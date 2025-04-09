import express from 'express';
import CGroup from '../controllers/group.controller';

import { Request, Response, NextFunction } from 'express';

// Middlewares

import MOwnerGroup from '../middlewares/owner-group.middleware';
import MIsAuthenticated from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', MIsAuthenticated, (req: Request, res: Response, next: NextFunction) => CGroup.createGroup(req, res, next));
router.put('/:id', MOwnerGroup, (req: Request, res: Response, next: NextFunction) => CGroup.putGroup(req, res, next));
router.put('/:id/archival', MOwnerGroup, (req: Request, res: Response, next: NextFunction) => CGroup.changeArchivalStatus(req, res, next));
router.delete('/:id', MOwnerGroup, (req: Request, res: Response, next: NextFunction) => CGroup.deleteGroup(req, res, next));

export default router;