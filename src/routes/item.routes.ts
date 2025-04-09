import express from 'express';
import CItem from '../controllers/item.controller';
import MIsAuthenticated from '../middlewares/auth.middleware';

import { NextFunction, Request, Response } from 'express';

const router = express.Router();

router.put('/', MIsAuthenticated, (req: Request, res: Response, next: NextFunction) => CItem.createItem(req, res, next));

export default router;