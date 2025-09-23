import express, { Request, Response } from 'express';
const expenseRouter = express.Router();
import expenseController from '../controllers/expenseController';

expenseRouter.post('/', expenseController.createExpense);

export default expenseRouter;
