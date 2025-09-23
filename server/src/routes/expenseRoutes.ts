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

export default expenseRouter;
