import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '../generated/prisma';

interface expenseData {
  userId: number;
  amount: number;
  dateAdded: Date;
  merchant: string;
  category: string;
  notes?: string;
}

const prisma = new PrismaClient();

export default class expenseController {
  static async createExpense(req: Request, res: Response) {
    try {
      const { merchant, category, notes } = req.body as expenseData;
      const userId = parseInt(req.body.userId);
      const amount = parseFloat(req.body.amount);
      const date = new Date(req.body.dateAdded);
      const expense = await prisma.expense.create({
        data: {
          amount,
          date,
          merchant,
          category,
          notes,
          user: {
            connect: { id: userId },
          },
        },
      });
      return res.status(200).json({
        success: true,
        data: { expense },
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
      });
    }
  }
}
