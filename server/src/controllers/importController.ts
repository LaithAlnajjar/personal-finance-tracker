import { Request, Response } from 'express';
import fs from 'node:fs';
import { parse } from 'csv-parse';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export const fileStorage = multer.diskStorage({
  destination: (
    request: Request,
    file: Express.Multer.File,
    callback: DestinationCallback
  ): void => {
    callback(null, './uploads');
  },

  filename: (req: Request, file: Express.Multer.File, callback: FileNameCallback): void => {
    callback(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: fileStorage });

if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

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
    const results: any[] = [];

    const records = [];
    const parser = fs
      .createReadStream(filePath)
      .pipe(parse({ columns: true, skip_empty_lines: true }));
    for await (const record of parser) {
      records.push(record);
    }

    try {
      for (const record of records) {
        const title = record.title;
        const amount = parseFloat(record.amount);
        const date = new Date(record.date);
        const merchant = record.merchant;
        const categoryId = record.categoryId;
        const expense = await prisma.expense.create({
          data: {
            title,
            amount,
            date,
            merchant,
            categoryId,
            user: {
              connect: { id: userId },
            },
          },
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
      });
    }
    return res.status(200).json(records);
  },
];

export default importCSV;
