import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes';
import expenseRouter from './routes/expenseRoutes';
import cors from 'cors';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRouter);
app.use('/api/expense', expenseRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}...`);
});
