const UserModel = require('../../userModel');

const saveUser = async user => {
  const newlyCreatedFakeUser = new UserModel(user);
  return newlyCreatedFakeUser.save();
};

const deleteUser = user => UserModel.findOneAndDelete({ email: user.email });

module.exports = {
  saveUser,
  deleteUser
};
