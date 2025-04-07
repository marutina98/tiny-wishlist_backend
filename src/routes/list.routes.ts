import express from 'express';
import CList from '../controllers/list.controller';
import MList from '../middlewares/list.middleware';

// Types and Interfaces

import { Request, Response } from 'express';

const router = express.Router();

router.get('/:id', MList, (req: Request, res: Response, next: Function) => CList.getList(req, res, next));

export default router;