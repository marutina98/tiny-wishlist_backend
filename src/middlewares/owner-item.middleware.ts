
import { NextFunction, Response } from 'express';
import prisma from '../prisma';

import IError from '../interfaces/error.interface';
import IRequestUser from '../interfaces/request-user.interface';

// Check that the authenticated user is the owner
// of the list otherwise throw error

export default async function MOwnerItem(req: IRequestUser, res: Response, next: NextFunction) {
  
  try {

    // Get the id of the item and fetch it

    const id = req.params.id;

    if (!id) {
      const error = new Error('Item id is missing.') as IError;
      error.status = 500;
      throw error;
    }

    const item = await prisma.item.findUniqueOrThrow({
      where: {
        id
      },
      include: {
        group: true,
      }
    });

    // Get list from item

    const list = await prisma.list.findFirstOrThrow({
      where: {
        id: item.group.listId
      },
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

    const isOwner = user.id === list.userId;

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