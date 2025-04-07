import prisma from './../prisma';
import { verify } from 'jsonwebtoken';

// Types and Interfaces

import { Request, Response } from 'express';
import IError from '../interfaces/error.interface';
import IRequestUser from '../interfaces/request-user.interface';

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

  public async createList(req: IRequestUser, res: Response, next: Function) {

    try {

      const user = req.user;

      if (!user) {
        const error = new Error('User is not authenticated.') as IError;
        error.status = 401;
        throw error;
      }
      
    } catch (error: unknown) {
      return next(error);
    }

  }

  public async changeVisibilityStatus(req: Request, res: Response, next: Function) {

    try {

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

    } catch (error: unknown) {
      return next(error);
    }

  }

  public async changeArchivalStatus(req: Request, res: Response, next: Function) {

    try {

      // Get the list or throw error

      const id = req.params.id;

      if (!id) {
        const error = (new Error('Valid Id not found.')) as IError;
        error.status = 404;
        throw error;
      }

      // Toggle the value of ogList.archived and return it

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
          archived: !ogList.archived,
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

}

export default new CList();