import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export default class AuthController {
  static register = async (req: Request, res: Response, next: NextFunction) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered',
      });
    }

    try {
      const hash = await bcrypt.hash(req.body.password, 10);
      const user = await prisma.user.create({
        data: {
          email: req.body.email,
          name: req.body.name,
          password: hash,
        },
      });
      return res.status(201).json({
        success: true,
        data: { user },
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
      });
    }
  };

  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
        expiresIn: '1h',
      });

      return res.status(200).json({
        success: true,
        data: { user, token },
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Login failed',
      });
    }
  };
}
