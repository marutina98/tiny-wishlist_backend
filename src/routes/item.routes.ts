import express from 'express';
import CItem from '../controllers/item.controller';

import MIsAuthenticated from '../middlewares/auth.middleware';
import MOwnerItem from '../middlewares/owner-item.middleware';

import { NextFunction, Request, Response } from 'express';

const router = express.Router();

router.post('/', MIsAuthenticated, (req: Request, res: Response, next: NextFunction) => CItem.createItem(req, res, next));
router.put('/:id', MIsAuthenticated, MOwnerItem, (req: Request, res: Response, next: NextFunction) => CItem.putItem(req, res, next));
router.put('/:id/archival', MIsAuthenticated, MOwnerItem, (req: Request, res: Response, next: NextFunction) => CItem.changeArchivalStatus(req, res, next));
router.put('/:id/reserved', MIsAuthenticated, MOwnerItem, (req: Request, res: Response, next: NextFunction) => CItem.changeReservedStatus(req, res, next));

export default router;