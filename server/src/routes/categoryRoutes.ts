import express, { Request, Response } from 'express';
const categoryRouter = express.Router();
import AuthMiddleware from '../middleware/authMiddleware';
import CategoryController from '../controllers/categoryController';

categoryRouter.get('/', AuthMiddleware.authenticateUser, CategoryController.getCategory);

categoryRouter.post('/', AuthMiddleware.authenticateUser, CategoryController.createCategory);

categoryRouter.put('/:id', AuthMiddleware.authenticateUser, CategoryController.updateCategory);

categoryRouter.delete('/:id', AuthMiddleware.authenticateUser, CategoryController.deleteCategory);

export default categoryRouter;
