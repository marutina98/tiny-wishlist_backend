import prisma from './../prisma';

// Types and Interfaces

import { NextFunction, Request, Response } from 'express';
import IError from '../interfaces/error.interface';

class CItem {

  public async createItem(req: Request, res: Response, next: NextFunction) {

  }

  public async putItem(req: Request, res: Response, next: NextFunction) {

  }

  public async changeArchivalStatus(req: Request, res: Response, next: NextFunction) {

  }

  public async changeReservedStatus(req: Request, res: Response, next: NextFunction) {

  }

  public async deleteItem(req: Request, res: Response, next: NextFunction) {

  }

}

export default new CItem();