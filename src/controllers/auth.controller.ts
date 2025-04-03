import prisma from './../prisma';
import SHelpers from './../services/helpers.service';

// Types and Interfaces

import { Request, Response } from 'express';
import IError from '../interfaces/error.interface';
import IUserOptionalPassword from '../interfaces/user-optional-password.interface';

class CAuth {

  public async register(req: Request, res: Response, next: Function)  {

    try {

      // Hash the received raw password

      const rawPassword = req.body.password;
      const hashedPassword = await SHelpers.hashPassword(rawPassword);

      // Replace the received raw password
      // with the hashed password

      const data = req.body;
      data.password = hashedPassword;

      // Create the user
      // Omit the password

      const user = await prisma.user.create({
        data,
        omit: {
          password: true
        }
      });

      // Throw error if user could not be created

      if (!user) {
        const error = new Error('User could not be created.') as IError;
        error.status = 409;
        return next(error);
      }

      // Generate the token and return it with the token

      const token = SHelpers.generateJWT(user.email);

      res.status(201).json({
        ...user,
        token
      });

    } catch (error: unknown) {
      console.error(error);
    }

  }

  // Login via Username

  public async login(req: Request, res: Response, next: Function) {

    try {

      // Find the user via username
      // Do not omit the password, it has to be compared

      const username = req.body.username;
      const user = await prisma.user.findUnique({
        where: {
          username
        }
      });

      if (!user) {
        const error = new Error(`User with username "${username}" could not be found.`) as IError;
        error.status = 409;
        return next(error);
      }

      // Compare the received rawPassword and the hashedPassword

      const rawPassword = req.body.password;
      const hashedPassword = user.password;

      const isPasswordCorrect = await SHelpers.comparePasswords(rawPassword, hashedPassword);

      if (!isPasswordCorrect) {
        const error = new Error('Password is not correct') as IError;
        error.status = 401;
        return next(error);
      }

      // Return the user with token
      // but first remove the password

      const token = SHelpers.generateJWT(user.username);

      delete (user as IUserOptionalPassword).password;

      res.status(200).json({
        ...user,
        token
      });

    } catch (error: unknown) {
      console.error(error);
    }

  }

}

export default new CAuth();