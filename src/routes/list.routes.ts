import express from 'express';

// Controller

import CList from '../controllers/list.controller';

// Middlewares

import MList from '../middlewares/list.middleware';
import MOwnerList from '../middlewares/owner-list.middleware';

// Types and Interfaces

import { Request, Response } from 'express';
import MIsAuthenticated from '../middlewares/auth.middleware';

const router = express.Router();

router.put('/', MIsAuthenticated, (req: Request, res: Response, next: Function) => CList.createList(req, res, next));
router.get('/:id', MList, (req: Request, res: Response, next: Function) => CList.getList(req, res, next));
router.put('/:id/visibility', MOwnerList, (req: Request, res: Response, next: Function) => CList.changeVisibilityStatus(req, res, next));
router.put('/:id/archival', MOwnerList, (req: Request, res: Response, next: Function) => CList.changeArchivalStatus(req, res, next));

export default router;