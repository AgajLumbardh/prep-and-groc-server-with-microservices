const UserModel = require('../../userModel');
const hashPassword = require('../../utils/hashPassword');

const saveUser = async user => {
  const hashedPassword = await hashPassword(user.password);
  const newlyCreatedFakeUser = new UserModel({
    ...user,
    password: hashedPassword
  });
  return newlyCreatedFakeUser.save();
};

const deleteUser = user => UserModel.findOneAndDelete({ email: user.email });

module.exports = {
  saveUser,
  deleteUser
};
