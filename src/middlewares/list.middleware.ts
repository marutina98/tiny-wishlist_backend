
import { NextFunction, Response } from 'express';
import prisma from '../prisma';
import { verify } from 'jsonwebtoken';

import IError from '../interfaces/error.interface';
import IRequestUser from '../interfaces/request-user.interface';
import IDecodedToken from '../interfaces/decoded-token.interface';

// If the list is public show directly
// if the list is private check that the authenticated
// user is the owner

export default async function MList(req: IRequestUser, res: Response, next: NextFunction) {
  
  try {

    // Get the id of the list and fetch it

    const id = req.params.id;

    if (!id) {
      const error = new Error('List id is missing.') as IError;
      error.status = 500;
      throw error;
    }

    const list = await prisma.list.findUniqueOrThrow({
      where: {
        id
      }
    });

    // If the list is public return the route
    // otherwise check that the authenticated user
    // is the owner

    if (!list.private) {
      
      next();

    } else {

      // Get authenticated user from token
      // check that the user is the owner

      const authorizationHeader = req.headers.authorization ?? null;
      
      if (!authorizationHeader) {
        const error = (new Error('User is not authenticated')) as IError;
        error.status = 403;
      }

      const token = authorizationHeader?.split(' ')[1];
      
      if (!token) {
        const error = (new Error('Token is not present.')) as IError;
        error.status = 403;
      }
      
      if (token) {
        
        const decodedToken = verify(token, 'JWT_SECRET') as unknown as IDecodedToken;
          
        const user = await prisma.user.findUnique({
          where: {
            email: decodedToken.email
          }
        });

        if (!user) {
          const error = new Error('User is not authenticated.') as IError;
          error.status = 401;
          throw error;
        }

        const isOwner = user.id === list.userId;

        if (!isOwner) {
          const error = new Error('Authenticated User is not Owner.') as IError;
          error.status = 401;
          throw error;
        }

        next();

      }

      const error = new Error('List could not be accessed.') as IError;
      error.status = 401;
      throw error;

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