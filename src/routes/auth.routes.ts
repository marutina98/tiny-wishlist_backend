import express from 'express';
import CAuth from '../controllers/auth.controller';

// Types and Interfaces

import { Request, Response } from 'express';

// Middlewares

import MIsGuest from '../middlewares/guest.middleware';

const router = express.Router();

router.post('/register', MIsGuest, (req: Request, res: Response, next: Function) => CAuth.register(req, res, next));
router.post('/login', MIsGuest, (req: Request, res: Response, next: Function) => CAuth.login(req, res, next));

export default router;