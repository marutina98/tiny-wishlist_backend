import prisma from './../prisma';
import { verify } from 'jsonwebtoken';

// Types and Interfaces

import { Request, Response } from 'express';
import IError from '../interfaces/error.interface';

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

      // I want to return the user that created
      // the list, instead of fetching them

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
          },
          user: true
        }
      });

      res.status(200).json(list);

    } catch (error: unknown) {
      return next(error);
    }

  }

  public async changeVisibilityStatus(req: Request, res: Response, next: Function) {

    // Get the list or throw error

    const id = req.params.id;

    if (!id) {
      const error = (new Error('Valid Id not found.')) as IError;
      error.status = 404;
      throw error;
    }

    // Toggle the value of ogList.private and return it

    const ogList = await prisma.list.findUniqueOrThrow({
      where: {
        id
      }
    });

    const list = await prisma.list.update({
      where: {
        id
      },
      data: {
        private: !ogList.private,
      },
      include: {
        priority: true,
        groups: {
          include: {
            items: true
          }
        },
        user: true
      }
    });

    res.status(200).json(list);

  }

}

export default new CList();