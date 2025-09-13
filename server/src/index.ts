import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from './generated/prisma';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

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

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
