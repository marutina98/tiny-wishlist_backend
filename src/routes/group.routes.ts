import express from 'express';
import CGroup from '../controllers/group.controller';

import { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => CGroup.createGroup(req, res, next));
router.put('/:id/archival', (req: Request, res: Response, next: NextFunction) => CGroup.changeArchivalStatus(req, res, next));
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => CGroup.deleteGroup(req, res, next));

export default router;