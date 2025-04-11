import prisma from './../prisma';
import { verify } from 'jsonwebtoken';

// Types and Interfaces

import IError from '../interfaces/error.interface';
import { NextFunction, Request, Response } from 'express';
import IDecodedToken from '../interfaces/decoded-token.interface';

class CUser {

  public async getUser (req: Request, res: Response, next: NextFunction) {
    
    try {

      const id = req.params.id;

      if (!id) {
        const error = (new Error('Valid Id not found.')) as IError;
        error.status = 404;
        throw error;
      }

      // Get User via Id and Omit password

      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id
        },
        omit: {
          password: true
        }
      });

      res.status(200).json(user);

    } catch (error: unknown) {
      return next(error);
    }

  }

  public async getAuthenticatedUser (req: Request, res: Response, next: NextFunction) {

    try {

      // Get Authorization Header
      // throw error if absent

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

      // In User include Lists, Groups and Items

      const user = await prisma.user.findUniqueOrThrow({
        where: {
          email
        },
        omit: { 
          password: true
        },
        include: {
          lists: {
            include: {
              priority: true,
              groups: {
                include: {
                  items: true
                }
              }
            }
          }
        }
      });

      res.status(200).json(user);

    } catch (error: unknown) {
      return next(error);
    }

  }

  

}

export default new CUser();