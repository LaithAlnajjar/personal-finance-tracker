import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

declare module 'express' {
  export interface Request {
    userId?: string;
  }
}

export default class AuthMiddleware {
  static authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Acess denied',
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
      req.userId = decoded.userId;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Acess denied',
      });
    }
  };
}
