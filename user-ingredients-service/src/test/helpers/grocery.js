const UserModel = require('../../userModel');

const saveGroceryItems = (groceryItems, userId) =>
  UserModel.findByIdAndUpdate(userId, {
    $push: { groceries: { $each: groceryItems } }
  });

const deleteGroceryItems = (groceryItems, userId) => {
  const groceryItemsIds = groceryItems.map(item => item._id);
  return UserModel.findByIdAndUpdate(userId, {
    $pull: { groceries: { _id: { $in: groceryItemsIds } } }
  });
};

const deleteAllGroceryItems = userId =>
  UserModel.findByIdAndUpdate(userId, { $set: { groceries: [] } });

module.exports = {
  saveGroceryItems,
  deleteGroceryItems,
  deleteAllGroceryItems
};
