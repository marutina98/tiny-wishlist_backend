import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Image } from 'canvas';

import validator from 'validator';

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

      // Check that string is a data uri format

      if (!validator.isDataURI(thumbnail)) {
        resolve(false);
      }

      // Check that image is valid

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

  public checkValidityURL(url: string) {
    return validator.isURL(url);
  }

  public checkValidityEmail(email: string) {
    return validator.isEmail(email);
  }

  // The username can only contain letters and numbers

  public checkValidityUsername(username: string) {
    const regex = /^[0-9A-Za-z]{6,16}$/;
    return regex.test(username);
  }

  public checkValidityInput(_input: string, minLength: number = 1, maxLength: number = 255, regexPattern?: RegExp) {

    const input = validator.trim(_input);

    if (
      input === '' ||
      input.length < minLength  ||
      input.length > maxLength ||
      (regexPattern && !regexPattern.test(input))
    ) {
      return false;
    }

    return true;

  }

  public sanitizeInput(input: string) {
    return validator.escape(
      validator.trim(input)
    );
  }

}

export default new SHelpers();