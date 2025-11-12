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
        if (req.query.from) {
          const from = new Date(req.query.from as string);
          where.date.gte = from;
        }
        if (req.query.to) {
          const to = new Date(req.query.to as string);
          where.date.lte = to;
        }
      }

      const expenses = await prisma.expense.findMany({ where, orderBy: { date: 'desc' } });
      return res.status(200).json({
        success: true,
        data: { expenses },
      });
    } catch (error) {
      console.error(error);
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

  static async getTotalExpenses(req: Request, res: Response) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not found',
        });
      }
      const userId = req.user.id;
      const totalEpxenses = await prisma.expense.count({
        where: { userId },
      });
      return res.status(200).json({
        success: true,
        data: { totalEpxenses },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
      });
    }
  }

  static async totalSpentLastMonth(req: Request, res: Response) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not found',
        });
      }
      const userId = req.user.id;

      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = now;

      const totalSpent = await prisma.expense.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
          userId,
        },
      });

      const total = totalSpent._sum.amount ?? 0;

      return res.status(200).json({
        success: true,
        data: { total },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
      });
    }
  }

  static async averageDailySpending(req: Request, res: Response) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not found',
        });
      }
      const userId = req.user.id;

      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = now;

      const averageSpending = await prisma.expense.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
          userId,
        },
      });

      const total = averageSpending._sum.amount ?? 0;
      const totalAverageSpending = total / 30;

      return res.status(200).json({
        success: true,
        data: { totalAverageSpending },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
      });
    }
  }

  static async getHighestSpendingCategory(req: Request, res: Response) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not found',
        });
      }
      const userId = req.user.id;
      const highestSpendingCategoryObject = await prisma.expense.groupBy({
        by: ['category'],
        where: {
          userId,
        },
        _sum: {
          amount: true,
        },
        orderBy: {
          _sum: {
            amount: 'desc',
          },
        },
        take: 1,
      });

      const highestSpendingCategory = highestSpendingCategoryObject[0]?.category ?? null;

      return res.status(200).json({
        success: true,
        data: { highestSpendingCategory },
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
