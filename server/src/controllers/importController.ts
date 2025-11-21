import { Request, Response } from 'express';
import fs from 'node:fs';
import { parse } from 'csv-parse';
import multer from 'multer';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export const fileStorage = multer.diskStorage({
  destination: (
    request: Request,
    file: Express.Multer.File,
    callback: DestinationCallback
  ): void => {
    // We'll store uploaded files in a temporary directory.
    callback(null, './uploads');
  },

  filename: (req: Request, file: Express.Multer.File, callback: FileNameCallback): void => {
    // Prepend timestamp to the original filename to prevent name collisions.
    callback(null, Date.now() + '-' + file.originalname);
  },
});

// This is our multer middleware for handling single file uploads.
const upload = multer({ storage: fileStorage });

if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// --- THIS IS THE RULE-BASED CATEGORIZER ---
/**
 * A simple rule-based categorizer.
 * It first tries to match a name, then falls back to merchant keywords.
 * TODO: This is a bit naive. Could be replaced with a more robust rules engine or ML model.
 */
const getCategoryId = (
  merchant: string,
  categoryName: string | undefined,
  categoryMap: Map<string, string>,
  uncategorizedId: string
): string => {
  // <-- FIXED TYPE (string)
  // 1. Try to match by the provided category name
  if (categoryName) {
    const id = categoryMap.get(categoryName.toLowerCase());
    // Check for undefined, not just truthy
    if (id !== undefined) {
      return id;
    }
  }

  // 2. If no direct category match, try to guess from merchant keywords.
  const lowerMerchant = merchant.toLowerCase();

  if (lowerMerchant.includes('coffee') || lowerMerchant.includes('restaurant')) {
    return categoryMap.get('dining') ?? uncategorizedId;
  }
  if (
    lowerMerchant.includes('uber') ||
    lowerMerchant.includes('taxi') ||
    lowerMerchant.includes('car')
  ) {
    return categoryMap.get('transport') ?? uncategorizedId;
  }
  if (
    lowerMerchant.includes('supermarket') ||
    lowerMerchant.includes('food') ||
    lowerMerchant.includes('grocer')
  ) {
    return categoryMap.get('groceries') ?? uncategorizedId;
  }

  // 3. Fallback to "Uncategorized"
  return uncategorizedId;
};

const importCSV = [
  upload.single('csvFile'),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User not found',
      });
    }
    const userId = req.user.id;
    const filePath = req.file.path;

    // This whole process is wrapped in a try/catch/finally to ensure the temp file is always deleted.
    try {
      // 1. Fetch user's categories ONCE
      const userCategories = await prisma.category.findMany({
        where: { userId },
        select: { id: true, name: true },
      });

      // 2. Create a fast lookup map (name -> id) for performance.
      // Avoids hitting the DB for every row in the CSV.
      const categoryMap = new Map<string, string>();
      userCategories.forEach((cat) => {
        categoryMap.set(cat.name.toLowerCase(), cat.id);
      });

      const uncategorizedId = categoryMap.get('uncategorized');

      // If the user somehow deleted their 'Uncategorized' category, we can't proceed.
      if (uncategorizedId === undefined) {
        return res.status(500).json({
          success: false,
          message: 'User account is missing an "Uncategorized" category.',
        });
      }

      // 3. Prepare an array for batch creation to improve DB performance.
      const expensesToCreate: Prisma.ExpenseCreateManyInput[] = [];

      const parser = fs
        .createReadStream(filePath)
        .pipe(parse({ columns: true, skip_empty_lines: true }));

      for await (const record of parser) {
        const amount = parseFloat(record.amount);
        const date = new Date(record.date);
        const merchant = record.merchant;

        // 4. Basic validation for each row. Skip rows that are obviously broken.
        if (isNaN(amount) || !date.getTime() || !merchant) {
          console.warn('Skipping invalid CSV row:', record);
          continue;
        }

        // 5. Run the categorizer
        const categoryId = getCategoryId(merchant, record.category, categoryMap, uncategorizedId);

        expensesToCreate.push({
          title: record.title || '',
          amount,
          date,
          merchant,
          categoryId,
          userId,
        });
      }

      // 6. Create all expenses in ONE database call
      if (expensesToCreate.length > 0) {
        const result = await prisma.expense.createMany({
          data: expensesToCreate,
        });

        return res.status(200).json({
          success: true,
          message: `Successfully imported ${result.count} expenses.`,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'No valid expenses found in CSV file.',
        });
      }
    } catch (err) {
      console.error(err);
      // P2003 is Prisma's error code for a foreign key constraint failure.
      // This can happen if the CSV contains a categoryId that doesn't exist for this user.
      if ((err as any).code === 'P2003') {
        return res.status(500).json({
          success: false,
          message:
            'CSV import failed: Foreign key constraint violation. A category ID was invalid.',
          error: (err as any).meta,
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Something went wrong during the import.',
      });
    } finally {
      // 7. Always delete the temp file, regardless of success or failure.
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Failed to delete temporary CSV file:', filePath, err);
        }
      });
    }
  },
];

export default importCSV;
