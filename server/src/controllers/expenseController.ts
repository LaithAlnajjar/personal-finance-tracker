import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default class expenseController {
  static async createExpense(req: Request, res: Response) {
    try {
      const { title, merchant, categoryId } = req.body;
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
          categoryId,
          userId: userId,
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
        where.category = {
          name: req.query.category as string,
        };
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

      const expenses = await prisma.expense.findMany({
        where,
        orderBy: { date: 'desc' },
        include: { category: true },
      });
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
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not found',
        });
      }
      const id = parseInt(req.params.expenseId);
      const userId = req.user.id;

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid expense ID',
        });
      }

      const result = await prisma.expense.deleteMany({
        where: {
          id,
          userId,
        },
      });

      if (result.count === 0) {
        return res.status(404).json({
          success: false,
          message: 'Expense not found or you do not have permission to delete it',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Expense deleted successfully',
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
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not found',
        });
      }

      const id = parseInt(req.params.expenseId);
      const userId = req.user.id;
      const { title, merchant, categoryId } = req.body;
      const amount = parseFloat(req.body.amount);
      const date = req.body.date ? new Date(req.body.date) : undefined;

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid expense ID',
        });
      }

      const dataToUpdate: any = {
        title,
        merchant,
        categoryId,
        amount,
        date,
      };

      Object.keys(dataToUpdate).forEach(
        (key) => dataToUpdate[key] === undefined && delete dataToUpdate[key]
      );

      if (isNaN(amount)) {
        delete dataToUpdate.amount;
      }

      const result = await prisma.expense.updateMany({
        where: {
          id,
          userId,
        },
        data: dataToUpdate,
      });

      if (result.count === 0) {
        return res.status(404).json({
          success: false,
          message: 'Expense not found or you do not have permission to edit it',
        });
      }

      const expense = await prisma.expense.findUnique({ where: { id } });

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

  static async totalSpentThisMonth(req: Request, res: Response) {
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
      const daysSoFar = now.getDate();

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
      const totalAverageSpending = daysSoFar > 0 ? total / daysSoFar : 0;

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

      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = now;

      const highestSpendingCategoryObject = await prisma.expense.groupBy({
        by: ['categoryId'],
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
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

      if (!highestSpendingCategoryObject || highestSpendingCategoryObject.length === 0) {
        return res.status(200).json({
          success: true,
          data: { highestSpendingCategory: null },
        });
      }

      const topCategory = highestSpendingCategoryObject[0];
      const total = topCategory._sum.amount ?? 0;

      if (!topCategory.categoryId) {
        return res.status(200).json({
          success: true,
          data: { highestSpendingCategory: { name: 'Uncategorized', total } },
        });
      }

      const category = await prisma.category.findUnique({
        where: { id: topCategory.categoryId },
        select: { name: true },
      });

      const result = {
        name: category?.name ?? 'Unknown',
        total: total,
      };

      return res.status(200).json({
        success: true,
        data: { highestSpendingCategory: result },
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
