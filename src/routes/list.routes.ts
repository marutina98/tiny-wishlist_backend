import express from 'express';
import CList from '../controllers/list.controller';

// Types and Interfaces

import { Request, Response } from 'express';

const router = express.Router();

router.get('/:id', (req: Request, res: Response, next: Function) => CList.getList(req, res, next));

export default router;