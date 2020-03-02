const User = require('../userModel');
const ObjectNotFoundError = require('../errors/ObjectNotFoundError');

module.exports = async userId => {
  const foundUser = await User.findById(userId);
  if (foundUser) {
    return foundUser;
  }
  throw new ObjectNotFoundError(`User with id ${userId} was not found.`);
};
