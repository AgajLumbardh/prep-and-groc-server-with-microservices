const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserModel = require('./userModel');
const ValidationError = require('./errors/ValidationError');
const hashPassword = require('./utils/hashPassword');

class UserService {
  static async login({ email, password }) {
    const user = await UserModel.findOne({ email });
    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (isPasswordCorrect) {
        return user;
      }
      throw new ValidationError({ password: 'Password is incorrect' });
    } else {
      throw new ValidationError({ email: 'E-mail address is not registered' });
    }
  }

  static async save(user) {
    const isUserSaved = await UserModel.findOne({ email: user.email });
    if (isUserSaved) {
      throw new ValidationError({
        email: 'E-mail address is already registered'
      });
    }
    const password = await hashPassword(user.password);
    const _id = mongoose.Types.ObjectId();
    const newUser = new UserModel({ ...user, password, _id });
    await newUser.save();
    return newUser;
  }
}

module.exports = UserService;
