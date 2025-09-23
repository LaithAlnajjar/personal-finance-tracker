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

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Mate');
});

app.get('/test-db', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({ take: 1 });
    res.json({ ok: true, users });
  } catch (error) {
    res.status(500).json({ ok: false, error: String(error) });
  }
});

app.get('/me', authMiddleware.authenticateUser, async (req: Request, res: Response) => {
  res.send('AUTHENTICATED');
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
