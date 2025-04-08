import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Image } from 'canvas';

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

  public isValidThumbnail(thumbnail: string) {

    return new Promise((resolve, reject) => {

      const image = new Image();

      image.onload = () => {
        resolve(image.width > 0 && image.height > 0);
      }

      image.onerror = () => {
        resolve(false);
      }

      image.src = thumbnail;

    });

  }

}

export default new SHelpers();