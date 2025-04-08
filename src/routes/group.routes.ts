import express from 'express';
import CGroup from '../controllers/group.controller';

import { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => CGroup.createGroup(req, res, next));

export default router;