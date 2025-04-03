import { Request, Response } from 'express';
import IError from '../interfaces/error.interface';

export default function errorHandlerMiddleware(error: IError, req: Request, res: Response, next: Function) {
  const status = error.status || 500;
  res.status(status).json({
    message: error.message
  });
}