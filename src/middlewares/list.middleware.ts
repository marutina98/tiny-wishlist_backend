
import { Response } from 'express';
import prisma from '../prisma';

import IError from '../interfaces/error.interface';
import IRequestUser from '../interfaces/request-user.interface';

// If the list is public show directly
// if the list is private check that the authenticated
// user is the owner

export default async function MList(req: IRequestUser, res: Response, next: Function) {
  
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

      // Get the user from the request
      // Check that the user is the owner
      // return the route or throw error

      const user = req.user;

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