import express from 'express';
import CUser from '../controllers/user.controller';

// Types and Interfaces

import { Request, Response } from 'express';

// Middleware

import MIsAuthenticated from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/auth', (req: Request, res: Response, next: Function) => CUser.getAuthenticatedUser(req, res, next));

export default router;