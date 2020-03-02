const UserModel = require('../../userModel');

const saveFridgeIngredient = (item, userId) =>
  UserModel.findByIdAndUpdate(userId, { $push: { fridge: item } });

const deleteFridgeIngredient = (_id, userId) =>
  UserModel.findByIdAndUpdate(userId, { $pull: { fridge: { _id } } });

const deleteAllFridgeIngredients = userId =>
  UserModel.findByIdAndUpdate(userId, { $set: { fridge: [] } });

module.exports = {
  saveFridgeIngredient,
  deleteFridgeIngredient,
  deleteAllFridgeIngredients
};
