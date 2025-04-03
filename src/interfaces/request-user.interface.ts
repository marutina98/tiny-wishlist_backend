import { User } from '@prisma/client';
import { Request } from 'express';

export default interface IRequestUser extends Request {
  user?: User
}