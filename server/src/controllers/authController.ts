import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
}
