
import { NextFunction, Response } from 'express';
import prisma from '../prisma';

import IError from '../interfaces/error.interface';
import IRequestUser from '../interfaces/request-user.interface';

// Check that the authenticated user is the owner
// of the group via its list otherwise throw error

export default async function MOwnerGroup(req: IRequestUser, res: Response, next: NextFunction) {
  
  try {

    // Get the id of the list and fetch it

    const id = req.params.id;

    if (!id) {
      const error = new Error('List id is missing.') as IError;
      error.status = 500;
      throw error;
    }

    const group = await prisma.group.findUniqueOrThrow({
      where: {
        id
      },
      include: {
        list: true
      }
    });

    // Get the user from the request
    // Check that the user is the owner
    // return the route or throw error

    const user = req.user;

    if (!user) {
      const error = new Error('User is not authenticated.') as IError;
      error.status = 401;
      throw error;
    }

    const isOwner = user.id === group.list.userId;

    if (!isOwner) {
      const error = new Error('Authenticated User is not Owner.') as IError;
      error.status = 401;
      throw error;
    }

    next();

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