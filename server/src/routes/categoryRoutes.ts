import express, { Request, Response } from 'express';
const categoryRouter = express.Router();
import AuthMiddleware from '../middleware/authMiddleware';
import CategoryController from '../controllers/categoryController';

categoryRouter.get('/', AuthMiddleware.authenticateUser, CategoryController.getCategory);

categoryRouter.post('/', AuthMiddleware.authenticateUser, CategoryController.createCategory);

export default categoryRouter;
