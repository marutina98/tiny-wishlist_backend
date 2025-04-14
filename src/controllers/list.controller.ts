import prisma from './../prisma';
import SHelpers from '../services/helpers.service';

// Types and Interfaces

import { NextFunction, Request, Response } from 'express';
import IError from '../interfaces/error.interface';
import IRequestUser from '../interfaces/request-user.interface';
import IRequestPutList from '../interfaces/request-put-list.interface';

class CList {

  public async getList(req: Request, res: Response, next: NextFunction) {

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

  public async createList(req: IRequestUser, res: Response, next: NextFunction) {

    // Create a List with a group called Default
    // New Items will be added to that list

    try {

      const user = req.user;

      if (!user) {
        const error = new Error('User is not authenticated.') as IError;
        error.status = 401;
        throw error;
      }

      // Check if received params are valid
      // add them to _data

      const _data: [string, string][] = [];

      const title = req.body.title ?? null;
      const description = req.body.description ?? null;
      const thumbnail = req.body.thumbnail ?? null;

      // TITLE and DESCRIPTION
      // check if they exists and are valid
      // add a sanitized version of them to _data

      if (title) {

        const isTitleValid = SHelpers.checkValidityInput(title);
        if (isTitleValid) {
          const sanitizedTitle = SHelpers.sanitizeInput(title);
          _data.push(['title', sanitizedTitle]);
        }

      }

      if (description) {

        const isDescriptionValid = SHelpers.checkValidityInput(title);
        if (isDescriptionValid) {
          const sanitizedDescription = SHelpers.sanitizeInput(description);
          _data.push(['description', sanitizedDescription]);
        }

      }

      // THUMBNAIL: check if it exists
      // if it doesn't, do not add
      // otherwise verify that it's valid

      if (thumbnail) {
        const isValidThumbnail = await SHelpers.isValidThumbnail(thumbnail);
        if (isValidThumbnail) _data.push(['thumbnail', thumbnail]);
      }

      // Throw error if _data is empty

      if (_data.length === 0) {
        const error = (new Error('Received Data was not valid.')) as IError;
        error.status = 400;
        throw error;
      }

      const data = Object.fromEntries(_data);

      const list = await prisma.list.create({

        data: {

          userId: user.id,
          title: data.title ?? '',
          description: data.description ?? '',
          thumbnail: data.thumbnail ?? '',
          private: false,
          archived: false,
          priorityId: 1,
          
          groups: {
            create: {
              title: 'Default',
              archived: false,
            }
          }

        },

        include: {
          priority: true,
          groups: {
            include: {
              items: true,
            }
          }
        }

      });

      res.status(200).json(list);
      
    } catch (error: unknown) {
      return next(error);
    }

  }

  public async changeVisibilityStatus(req: Request, res: Response, next: NextFunction) {

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

  public async changeArchivalStatus(req: Request, res: Response, next: NextFunction) {

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

  public async changePriority(req: Request, res: Response, next: NextFunction) {
    
    try {

      // Get the list or throw error

      const id = req.params.id;

      if (!id) {
        const error = (new Error('Valid Id not found.')) as IError;
        error.status = 404;
        throw error;
      }

      // Get the priorityId
      // if missing or invalid throw error

      const priorityId = req.body.priorityId;
      const isPriorityIdValid = priorityId >= 1 && priorityId <= 3;

      if (!priorityId) {
        const error = (new Error('Priority Id not found.')) as IError;
        error.status = 404;
        throw error;
      }

      if (!isPriorityIdValid) {
        const error = (new Error('Priority Id is not valid.')) as IError;
        error.status = 400;
        throw error;
      }

      // Check if list exists
      // if not found, throw error

      await prisma.list.findUniqueOrThrow({
        where: {
          id
        }
      });

      // Update the priority

      const list = await prisma.list.update({
        where: {
          id
        },
        data: {
          priorityId
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

  public async putList(req: Request, res: Response, next: NextFunction) {

    try {

      const id = req.params.id;

      if (!id) {
        const error = (new Error('Valid Id not found.')) as IError;
        error.status = 404;
        throw error;
      }

      // Check if list exists
      // if not found, throw error

      await prisma.list.findUniqueOrThrow({
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

      // Check if received params are valid
      // add them to _data

      const _data: [string, string][] = [];

      const title = req.body.title ?? null;
      const description = req.body.description ?? null;
      const thumbnail = req.body.thumbnail ?? null;

      // TITLE and DESCRIPTION
      // check if they exists and are valid
      // add a sanitized version of them to _data

      if (title) {

        const isTitleValid = SHelpers.checkValidityInput(title);
        if (isTitleValid) {
          const sanitizedTitle = SHelpers.sanitizeInput(title);
          _data.push(['title', sanitizedTitle]);
        }

      }

      if (description) {

        const isDescriptionValid = SHelpers.checkValidityInput(title);
        if (isDescriptionValid) {
          const sanitizedDescription = SHelpers.sanitizeInput(description);
          _data.push(['description', sanitizedDescription]);
        }

      }

      // THUMBNAIL: check if it exists
      // if it doesn't, do not add
      // otherwise verify that it's valid

      if (thumbnail) {
        const isValidThumbnail = await SHelpers.isValidThumbnail(thumbnail);
        if (isValidThumbnail) _data.push(['thumbnail', thumbnail]);
      }

      // Throw error if _data is empty

      if (_data.length === 0) {
        const error = (new Error('Received Data was not valid.')) as IError;
        error.status = 400;
        throw error;
      }

      const data: IRequestPutList = Object.fromEntries(_data);

      const list = await prisma.list.update({
        where: {
          id
        },
        data: data,
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

  public async deleteList(req: Request, res: Response, next: NextFunction) {

    try {

      const id = req.params.id;

      if (!id) {
        const error = (new Error('Valid Id not found.')) as IError;
        error.status = 404;
        throw error;
      }

      // Check if list exists
      // if not found, throw error

      await prisma.list.findUniqueOrThrow({
        where: {
          id
        }
      });

      // Delete list

      await prisma.list.delete({
        where: {
          id
        }
      });

      res.status(200).json({
        message: `List with id ${id} was successfully deleted`
      });

    } catch (error: unknown) {
      return next(error);
    }

  }

}

export default new CList();