import prisma from './../prisma';

// Types and Interfaces

import { NextFunction, Request, Response } from 'express';
import IError from '../interfaces/error.interface';

class CItem {

  public async createItem(req: Request, res: Response, next: NextFunction) {

    try {

    } catch (error: unknown) {
      return next(error);
    }

  }

  public async putItem(req: Request, res: Response, next: NextFunction) {

    try {

    } catch (error: unknown) {
      return next(error);
    }

  }

  public async changeArchivalStatus(req: Request, res: Response, next: NextFunction) {

    try {

    } catch (error: unknown) {
      return next(error);
    }

  }

  public async changeReservedStatus(req: Request, res: Response, next: NextFunction) {

    try {

    } catch (error: unknown) {
      return next(error);
    }

  }

  public async deleteItem(req: Request, res: Response, next: NextFunction) {

    try {

      const id = req.params.id;
      
      if (!id) {
        const error = (new Error('Valid Id not found.')) as IError;
        error.status = 404;
        throw error;
      }

      // Check if item exists
      // if not found, throw error

      await prisma.item.findUniqueOrThrow({
        where: {
          id
        }
      });

      // Delete item

      await prisma.item.delete({
        where: {
          id
        }
      });

      res.status(200).json({
        message: `Item with id ${id} was successfully deleted`
      });

    } catch (error: unknown) {
      return next(error);
    }

  }

}

export default new CItem();