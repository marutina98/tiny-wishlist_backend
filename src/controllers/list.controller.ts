import prisma from './../prisma';
import { verify } from 'jsonwebtoken';

// Types and Interfaces

import { Request, Response } from 'express';
import IError from '../interfaces/error.interface';
import IDecodedToken from '../interfaces/decoded-token.interface';

class CList {

  public async getList(req: Request, res: Response, next: Function) {

    try {

      // If a list is private show only
      // if the user is logged and is the author

      const id = req.params.id;

      // If the id is not valid throw error

      if (!id) {
        const error = (new Error('Valid Id not found.')) as IError;
        error.status = 404;
        throw error;
      }

      // Get List or throw error

      const list = await prisma.list.findUniqueOrThrow({
        where: {
          id
        },
        include: {
          priority: true,
          groups: {
            include: {
              items: true
            }
          }
        }
      });

      // If the list is public return
      // otherwise check if the authenticated user is
      // the author

      if (!list.private) {
        return res.status(200).json(list);
      }

      // Check if user is authenticated

      const authorizationHeader = req.headers.authorization ?? null;
            
      if (!authorizationHeader) {
        const error = (new Error('User is not authenticated')) as IError;
        error.status = 403;
        throw error;
      }

      // Get Token from Authorization Header

      const token = authorizationHeader?.split(' ')[1];
      const decodedToken = verify(token, 'JWT_SECRET') as IDecodedToken;
      
      if (!decodedToken) {
        const error = (new Error('Token is not present.')) as IError;
        error.status = 403;
        throw error;
      }

      // Get User via Email decoded from Token
      // Find user or throw error

      const email = decodedToken.email;

      if (!email) {
        const error = new Error('Email could not be found in token.') as IError;
        error.status = 500;
        throw error;
      }

      // Find authenticated User
      // check that authenticated user is the author

      const user = await prisma.user.findUniqueOrThrow({
        where: {
          email
        }
      });

      if (user.id === list.userId) {
        res.status(200).json(list);
      }

      const error = new Error(`Authenticated User is not the Author of List with id ${id}`) as IError;
      error.status = 401;
      throw error;

    } catch (error: unknown) {
      return next(error);
    }

  }

}

export default new CList();