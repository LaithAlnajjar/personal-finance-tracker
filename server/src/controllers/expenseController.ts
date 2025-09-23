import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export default class expenseController {
  static async createExpense(req: Request, res: Response) {
    try {
      const { merchant, category, notes } = req.body;
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

  static async getAllExpensesById(req: Request, res: Response) {
    try {
      const userId = parseInt(req.body.userId);
      const expenses = await prisma.expense.findMany({
        where: {
          userId,
        },
      });
      return res.status(200).json({
        success: true,
        data: { expenses },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
      });
    }
  }

  static async deleteExpense(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.expenseId);
      const expense = await prisma.expense.delete({
        where: {
          id,
        },
      });
      return res.status(200).json({
        success: true,
        data: { expense },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
      });
    }
  }
}
