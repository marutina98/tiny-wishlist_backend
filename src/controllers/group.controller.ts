import prisma from './../prisma';
import helpersService from '../services/helpers.service';

import { NextFunction, Request, Response } from 'express';
import IError from '../interfaces/error.interface';

class CGroup {

  public async createGroup(req: Request, res: Response, next: NextFunction) {

    try {

      // Check that list id is valid
      // otherwise throw error

      const listId = req.body.listId;

      if (!listId) {
        const error = (new Error('Valid List Id not found.')) as IError;
        error.status = 404;
        throw error;
      }

      await prisma.list.findUniqueOrThrow({
        where: {
          id: listId
        }
      });

      // Make sure that the title exists and is valid

      const title = req.body.title;

      if (!title) {
        const error = (new Error('No Title for the Group was provided.')) as IError;
        error.status = 400;
        throw error;
      }

      const isTitleValid = helpersService.checkValidityInput(title);

      if (!isTitleValid) {
        const error = (new Error('No Valid Title for the Group was provided.')) as IError;
        error.status = 400;
        throw error;
      }

      const sanitizedTitle = helpersService.sanitizeInput(title);

      // Create and return group

      const group = await prisma.group.create({
        data: {
          listId,
          title: sanitizedTitle,
          archived: false
        }
      });

      res.status(200).json(group);

    } catch (error: unknown) {
      return next(error);
    }

  }

  public async putGroup(req: Request, res: Response, next: NextFunction) {

  }

  public async changeArchivalStatus(req: Request, res: Response, next: NextFunction) {

    try {
      
      const id = req.params.id;

      if (!id) {
        const error = (new Error('Valid Id not found.')) as IError;
        error.status = 404;
        throw error;
      }

      // Check if group exists
      // if not found, throw error

      const ogGroup = await prisma.group.findUniqueOrThrow({
        where: {
          id
        }
      });

      // Toggle group's archived status

      const group = await prisma.group.update({
        where: {
          id
        },
        data: {
          archived: !ogGroup.archived
        }
      });

      res.status(200).json(group);

    } catch (error: unknown) {
      return next(error);
    }
    
  }

  public async deleteGroup(req: Request, res: Response, next: NextFunction) {

    try {
      
      const id = req.params.id;

      if (!id) {
        const error = (new Error('Valid Id not found.')) as IError;
        error.status = 404;
        throw error;
      }

      // Check if group exists
      // if not found, throw error

      await prisma.group.findUniqueOrThrow({
        where: {
          id
        }
      });

      // Delete group

      await prisma.group.delete({
        where: {
          id
        }
      });

      res.status(200).json({
        message: `Group with id ${id} was successfully deleted`
      });

    } catch (error: unknown) {
      return next(error);
    }

  }

}

export default new CGroup();