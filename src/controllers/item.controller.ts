import prisma from './../prisma';
import helpersService from '../services/helpers.service';

// Types and Interfaces

import { NextFunction, Request, Response } from 'express';
import IError from '../interfaces/error.interface';
import IRequestPostItem from '../interfaces/request-post-item.interface';

class CItem {

  public async createItem(req: Request, res: Response, next: NextFunction) {

    try {

      // Check that group id is valid
      // otherwise throw error

      const groupId = req.body.groupId;

      if (!groupId) {
        const error = (new Error('Valid Group Id not found.')) as IError;
        error.status = 404;
        throw error;
      }

      await prisma.group.findUniqueOrThrow({
        where: {
          id: groupId
        }
      });

      // Check if received params are valid
      // add them to _data

      const _data = [];

      const title = req.params.title ?? null;
      const description = req.params.description ?? null;
      const thumbnail = req.params.thumbnail ?? null;
      const url = req.params.url ?? null;
      const quantity = req.params.quantity ?? null;
      const price = req.params.price ?? null;

      // TITLE and DESCRIPTION
      // check if they exists and are valid
      // add a sanitized version of them to _data

      if (title) {

        const isTitleValid = helpersService.checkValidityInput(title);
        if (isTitleValid) {
          const sanitizedTitle = helpersService.sanitizeInput(title);
          _data.push(['title', sanitizedTitle]);
        }

      }

      if (description) {

        const isDescriptionValid = helpersService.checkValidityInput(title);
        if (isDescriptionValid) {
          const sanitizedDescription = helpersService.sanitizeInput(description);
          _data.push(['description', sanitizedDescription]);
        }

      }

      // THUMBNAIL: check if it exists
      // if it doesn't, do not add
      // otherwise verify that it's valid

      if (thumbnail) {
        const isValidThumbnail = await helpersService.isValidThumbnail(thumbnail);
        if (isValidThumbnail) _data.push(['thumbnail', thumbnail]);
      }

      // URL, Quantity and Price

      if (url) {
        const isValidURL = await helpersService.checkValidityURL(url);
        if (isValidURL) _data.push(['url', url]);
      }

      if (quantity && typeof quantity === 'number') {
        const isValidQuantity = quantity > 0;
        if (isValidQuantity) _data.push(['quantity', quantity]);
      }

      if (price && typeof price === 'number') {
        const isValidPrice = price > 0;
        if (isValidPrice) {
          const fixedPrice = parseInt(price).toFixed(2);
          _data.push(['price', fixedPrice]);
        }
      }

      // Throw error if _data is empty

      if (_data.length === 0) {
        const error = (new Error('Received Data was not valid.')) as IError;
        error.status = 400;
        throw error;
      }

      _data.push(['groupId', groupId]);

      const data = Object.fromEntries(_data);

      // add group id to _data after checking that
      // the rest of data is valid

      // Create and return group

      const item = await prisma.item.create({
        data
      });

      res.status(200).json(item);

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

      // Get the item or throw error
      
      const id = req.params.id;

      if (!id) {
        const error = (new Error('Valid Id not found.')) as IError;
        error.status = 404;
        throw error;
      }

      const ogItem = await prisma.item.findUniqueOrThrow({
        where: {
          id
        }
      });

      // Toggle the value of ogItem.archived and return it

      const item = await prisma.item.update({
        where: {
          id
        },
        data: {
          archived: !ogItem.archived
        }
      });

      res.status(200).json(item);

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