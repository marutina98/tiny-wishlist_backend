import prisma from './../prisma';
import { verify } from 'jsonwebtoken';

// Types and Interfaces

import { Request, Response } from 'express';
import IError from '../interfaces/error.interface';
import IDecodedToken from '../interfaces/decoded-token.interface';

class CList {

  public async getList(req: Request, res: Response, next: Function) {

    try {

      // Return the list directly
      // the handling of who can see it
      // it's already done in the middleware

      const id = req.params.id;

      if (!id) {
        const error = (new Error('Valid Id not found.')) as IError;
        error.status = 404;
        throw error;
      }

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

      res.status(200).json(list);

    } catch (error: unknown) {
      return next(error);
    }

  }

}

export default new CList();