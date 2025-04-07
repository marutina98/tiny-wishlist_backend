import express from 'express';

// Controller

import CList from '../controllers/list.controller';

// Middlewares

import MList from '../middlewares/list.middleware';
import MOwnerList from '../middlewares/owner-list.middleware';

// Types and Interfaces

import { Request, Response } from 'express';

const router = express.Router();

router.get('/:id', MList, (req: Request, res: Response, next: Function) => CList.getList(req, res, next));
router.get('/:id/visibility', MOwnerList, (req: Request, res: Response, next: Function) => CList.changeVisibilityStatus(req, res, next));

export default router;