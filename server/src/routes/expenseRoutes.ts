import express, { Request, Response } from 'express';
const expenseRouter = express.Router();
import expenseController from '../controllers/expenseController';

expenseRouter.post('/', expenseController.createExpense);

expenseRouter.get('/', expenseController.getAllExpensesById);

expenseRouter.delete('/:expenseId', expenseController.deleteExpense);

expenseRouter.put('/:expenseId', expenseController.editExpense);

export default expenseRouter;
