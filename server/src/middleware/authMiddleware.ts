import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

declare module 'express' {
  export interface Request {
    user?: { id: number };
  }
}

export default class AuthMiddleware {
  static authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const header = req.header('Authorization');

    if (!header) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header missing',
      });
    }

    const parts = header.split(' ');
    const token = parts[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
      req.user = { id: decoded.userId };
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Acess denied',
      });
    }
  };
}
