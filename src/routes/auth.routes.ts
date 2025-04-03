import express from 'express';
import CAuth from '../controllers/auth.controller';

import { Request, Response } from 'express';

const router = express.Router();

router.post('/register', (req: Request, res: Response, next: Function) => CAuth.register(req, res, next));
router.post('/login', (req: Request, res: Response, next: Function) => CAuth.login(req, res, next));

export default router;