import express, { Request, Response } from 'express';
const authRouter = express.Router();
import authController from '../controllers/authController';

authRouter.post('/register', authController.register);

export default authRouter;
