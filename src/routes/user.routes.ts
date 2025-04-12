import express from 'express';
import CUser from '../controllers/user.controller';

// Types and Interfaces

import { NextFunction, Request, Response } from 'express';

// Middleware

import MIsAuthenticated from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/auth', MIsAuthenticated, (req: Request, res: Response, next: NextFunction) => CUser.getAuthenticatedUser(req, res, next));
router.put('/', MIsAuthenticated, (req: Request, res: Response, next: NextFunction) => CUser.putUser(req, res, next));
router.delete('/', MIsAuthenticated, (req: Request, res: Response, next: NextFunction) => CUser.deleteUser(req, res, next));

export default router;