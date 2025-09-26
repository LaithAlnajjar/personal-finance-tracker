import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export default class expenseController {
  static async createExpense(req: Request, res: Response) {
    try {
      const { title, merchant, category, notes } = req.body;
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not found',
        });
      }
      const userId = req.user.id;
      const amount = parseFloat(req.body.amount);
      const date = new Date(req.body.date);
      console.log(req.body);
      const expense = await prisma.expense.create({
        data: {
          title,
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
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
      });
    }
  }

  static async getAllExpensesById(req: Request, res: Response) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not found',
        });
      }
      const userId = req.user.id;
      const where: any = { userId };
      if (req.query.category) {
        where.category = req.query.category;
      }

      if (req.query.from || req.query.to) {
        where.date = {};
        if (req.query.from) where.date.gte = req.query.from;
        if (req.query.to) where.date.lte = req.query.to;
      }

      const expenses = await prisma.expense.findMany({ where, orderBy: { date: 'desc' } });
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

  static async editExpense(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.expenseId);
      const { merchant, category, notes } = req.body;
      const amount = parseFloat(req.body.amount);
      const expense = await prisma.expense.update({
        where: {
          id,
        },
        data: {
          amount,
          merchant,
          category,
          notes,
        },
      });
      return res.status(200).json({
        success: true,
        data: { expense },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
      });
    }
  }
}
