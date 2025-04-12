import prisma from './../prisma';
import SHelpers from './../services/helpers.service';

// Types and Interfaces

import { NextFunction, Request, Response } from 'express';
import IError from '../interfaces/error.interface';
import IUserOptionalPassword from '../interfaces/user-optional-password.interface';

class CAuth {

  public async register(req: Request, res: Response, next: NextFunction)  {

    try {

      // Check that the password is strong
      // Hash the received raw password

      const rawPassword = req.body.password;

      const isStrongPassword = SHelpers.checkValidityPassword(rawPassword);

      if (!isStrongPassword) {
        const error = new Error('Password is not strong enough.') as IError;
        error.status = 400;
        throw error;
      }

      const hashedPassword = await SHelpers.hashPassword(rawPassword);

      // Replace the received raw password
      // with the hashed password

      const data = req.body;
      data.password = hashedPassword;

      // @todo: validate email
      // throw error otherwise

      const email = data.email;
      const username = data.username;

      if (!email) {
        const error = new Error('Email was not received.') as IError;
        error.status = 400;
        throw error;
      }

      const isEmailValid = SHelpers.checkValidityEmail(email);

      if (!isEmailValid) {
        const error = new Error('Email was not valid') as IError;
        error.status = 400;
        throw error;
      }

      // validate username

      if (!username) {
        const error = new Error('Username was not received.') as IError;
        error.status = 400;
        throw error;
      }

      const isUsernameValid = SHelpers.checkValidityUsername(username);

      if (!isUsernameValid) {
        const error = new Error('Username was not valid') as IError;
        error.status = 400;
        throw error;
      }

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
        throw error;
      }

      // Generate the token and return it with the token

      const token = SHelpers.generateJWT(user.email);

      res.status(201).json({
        ...user,
        token
      });

    } catch (error: unknown) {
      return next(error);
    }

  }

  // Login via Username

  public async login(req: Request, res: Response, next: NextFunction) {

    try {

      // Find the user via username
      // Do not omit the password, it has to be compared

      const username = req.body.username;
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          username
        }
      });

      // Compare the received rawPassword and the hashedPassword

      const rawPassword = req.body.password;
      const hashedPassword = user.password;

      const isPasswordCorrect = await SHelpers.comparePasswords(rawPassword, hashedPassword);

      if (!isPasswordCorrect) {
        const error = new Error('Password is not correct') as IError;
        error.status = 401;
        throw error;
      }

      // Return the user with token
      // but first remove the password

      const token = SHelpers.generateJWT(user.email);

      delete (user as IUserOptionalPassword).password;

      res.status(200).json({
        ...user,
        token
      });

    } catch (error: unknown) {
      return next(error);
    }

  }

}

export default new CAuth();