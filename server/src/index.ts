import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes';
import expenseRouter from './routes/expenseRoutes';
import importRouter from './routes/importRoutes';
import categoryRouter from './routes/categoryRoutes';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRouter);
app.use('/api/expense', expenseRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/import', importRouter);

const PORT = process.env.PORT;
app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}...`);
});
