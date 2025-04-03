import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';

class SHelpers {

  public hashPassword(rawPassword: string, saltRounds: number = 10) {
    return bcrypt.hash(rawPassword, saltRounds);
  }

  public comparePasswords(rawPassword: string, hashedPassword: string) {
    return bcrypt.compare(rawPassword, hashedPassword);
  }

  public generateJWT(email: string) {
    return sign({ email }, 'JWT_SECRET');
  }

}

export default new SHelpers();