
import { verify } from 'jsonwebtoken';

// Types and Interfaces

import { Request, Response } from 'express';
import IError from '../interfaces/error.interface';

export default async function MIsGuest (req: Request, res: Response, next: Function) {

  // If the authorization header is null
  // or the token is not valid
  // continue otherwise throw error

  const authorizationHeader = req.headers.authorization ?? null;
 
  if (!authorizationHeader) return next();

  const token = authorizationHeader.split(' ')[1];

  if (!token) return next();

  try {

    if (token) {

      verify(token, 'JWT_SECRET');

      // Throw an error if the token is valid
      
      const error = new Error('User is not a guest.') as IError;
      error.status = 401;
      throw error;

    }

  } catch (error: unknown) {
    return next();
  }

}