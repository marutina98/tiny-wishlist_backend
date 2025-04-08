import { NextFunction, Request, Response } from 'express';
import IError from '../interfaces/error.interface';

export default function MErrorHandler(error: IError, req: Request, res: Response, next: NextFunction) {
  const status = error.status || 500;
  console.error(error);
  res.status(status).json({
    message: error.message
  });
}