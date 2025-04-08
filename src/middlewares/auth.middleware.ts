
import { verify } from 'jsonwebtoken';
import prisma from '../prisma';

// Types and Interfaces

import { NextFunction, Response } from 'express';
import IError from '../interfaces/error.interface';
import IRequestUser from '../interfaces/request-user.interface';
import IDecodedToken from '../interfaces/decoded-token.interface';

export default async function MIsAuthenticated (req: IRequestUser, res: Response, next: NextFunction) {

  // Get Authorization Header
  // Throw error if null
  
  const authorizationHeader = req.headers.authorization ?? null;

  if (!authorizationHeader) {
    const error = (new Error('User is not authenticated')) as IError;
    error.status = 403;
  }

  // Get token if absent or invalid throw error

  const token = authorizationHeader?.split(' ')[1];

  if (!token) {
    const error = (new Error('Token is not present.')) as IError;
    error.status = 403;
  }

  try {

    // If the token is valid continue
    // throw error otherwise

    if (token) {

      const decodedToken = verify(token, 'JWT_SECRET') as IDecodedToken;
    
      const user = await prisma.user.findUnique({
        where: {
          email: decodedToken.email
        }
      });
  
      req.user = user ?? undefined;

      next();

    }

  } catch (error: unknown) {
  
    const status = (error as IError).status || 500;
    const message = (error as IError).message;

    res.status(status).json({
      message: `ERROR: ${message}`,
      status: status
    });

    console.error(error);
    
  } 

}