import express, { Request, Response } from 'express';
const expenseRouter = express.Router();
import expenseController from '../controllers/expenseController';
import AuthMiddleware from '../middleware/authMiddleware';

expenseRouter.post('/', AuthMiddleware.authenticateUser, expenseController.createExpense);

expenseRouter.get('/', AuthMiddleware.authenticateUser, expenseController.getAllExpensesById);

expenseRouter.delete(
  '/:expenseId',
  AuthMiddleware.authenticateUser,
  expenseController.deleteExpense
);

expenseRouter.put('/:expenseId', AuthMiddleware.authenticateUser, expenseController.editExpense);

expenseRouter.get(
  '/getTotalExpenses',
  AuthMiddleware.authenticateUser,
  expenseController.getTotalExpenses
);

expenseRouter.get(
  '/getTotalSpentThisMonth',
  AuthMiddleware.authenticateUser,
  expenseController.totalSpentLastMonth
);

expenseRouter.get(
  '/getAvergeDailySpending',
  AuthMiddleware.authenticateUser,
  expenseController.averageDailySpending
);

expenseRouter.get(
  '/getHighestSpendingCategory',
  AuthMiddleware.authenticateUser,
  expenseController.getHighestSpendingCategory
);

export default expenseRouter;
