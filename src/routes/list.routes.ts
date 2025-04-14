import express from 'express';

// Controller

import CList from '../controllers/list.controller';

// Middlewares

import MList from '../middlewares/list.middleware';
import MOwnerList from '../middlewares/owner-list.middleware';
import MIsAuthenticated from '../middlewares/auth.middleware';

// Types and Interfaces

import { NextFunction, Request, Response } from 'express';

const router = express.Router();

router.post('/', MIsAuthenticated, (req: Request, res: Response, next: NextFunction) => CList.createList(req, res, next));
router.get('/:id', MList, (req: Request, res: Response, next: NextFunction) => CList.getList(req, res, next));
router.put('/:id', MIsAuthenticated, MOwnerList, (req: Request, res: Response, next: NextFunction) => CList.putList(req, res, next));
router.put('/:id/visibility', MIsAuthenticated, MOwnerList, (req: Request, res: Response, next: NextFunction) => CList.changeVisibilityStatus(req, res, next));
router.put('/:id/archival', MIsAuthenticated, MOwnerList, (req: Request, res: Response, next: NextFunction) => CList.changeArchivalStatus(req, res, next));
router.put('/:id/priority', MIsAuthenticated, MOwnerList, (req: Request, res: Response, next: NextFunction) => CList.changePriority(req, res, next));
router.delete('/:id', MIsAuthenticated, MOwnerList, (req: Request, res: Response, next: NextFunction) => CList.deleteList(req, res, next));

export default router;