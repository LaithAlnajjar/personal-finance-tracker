import express, { Request, Response } from 'express';
import importCSV from '../controllers/importController';
import AuthMiddleware from '../middleware/authMiddleware';

const importRouter = express.Router();

importRouter.post('/', AuthMiddleware.authenticateUser, importCSV);

export default importRouter;
