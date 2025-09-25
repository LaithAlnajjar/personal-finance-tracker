import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from './generated/prisma';
import authRouter from './routes/authRoutes';
import expenseRouter from './routes/expenseRoutes';
import authMiddleware from './middleware/authMiddleware';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRouter);
app.use('/api/expense', expenseRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
