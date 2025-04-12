import prisma from './../prisma';
import { verify } from 'jsonwebtoken';
import SHelpers from './../services/helpers.service';

// Types and Interfaces

import { NextFunction, Request, Response } from 'express';
import IError from '../interfaces/error.interface';
import IDecodedToken from '../interfaces/decoded-token.interface';
import IRequestUser from '../interfaces/request-user.interface';
import IUserOptionalPassword from '../interfaces/user-optional-password.interface';

class CUser {

  public async getUser(req: Request, res: Response, next: NextFunction) {
    
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

  public async getAuthenticatedUser(req: Request, res: Response, next: NextFunction) {

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

  public async putUser(req: IRequestUser, res: Response, next: NextFunction) {

    try {

      // Find user and update

      const _user = req.user;
      
      if (!_user) {
        const error = new Error('User is not authenticated.') as IError;
        error.status = 401;
        throw error;
      }

      // The user can update: email, username and password

      const email = req.body.email ?? null;
      const username = req.body.username ?? null;
      const password = req.body.password ?? null;

      const _data: [string, string][] = [];

      // Validate email, username and/or password
      // when present

      if (email && email.length > 0) {
        const isEmailValid = SHelpers.checkValidityEmail(email);
        if (isEmailValid) _data.push(['email', email]);
      }

      if (username && username.length > 0) {
        const isUsernameValid = SHelpers.checkValidityUsername(username);
        if (isUsernameValid) _data.push(['username', username]);
      }

      if (password && password.length > 0) {
        const hashedPassword = await SHelpers.hashPassword(password);
        _data.push(['password', hashedPassword]);
      }

      // Check if data is valid
      // otherwise throw error

      if (_data.length === 0) {
        const error = (new Error('Received Data was not valid.')) as IError;
        error.status = 400;
        throw error;
      }

      const data = Object.fromEntries(_data);

      // Update user

      const user = await prisma.user.update({
        where: {
          id: _user.id
        },
        data,
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

      // Generate new token
      // Return user with token

      const token = SHelpers.generateJWT(user.email);

      res.status(200).json({
        ...user,
        token
      });

    } catch(error: unknown) {
      return next(error);
    }

  }

  public async deleteUser(req: IRequestUser, res: Response, next: NextFunction) {

    try {

      // Found user and delete

      const user = req.user;
      
      if (!user) {
        const error = new Error('User is not authenticated.') as IError;
        error.status = 401;
        throw error;
      }

      await prisma.user.delete({
        where: {
          id: user.id
        }
      });

      res.status(200).json({
        message: 'User was successfully deleted.',
      });

    } catch(error: unknown) {
      return next(error);
    }

  }

}

export default new CUser();