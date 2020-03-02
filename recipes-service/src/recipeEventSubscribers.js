/* eslint-disable no-console */
const eventEmitterDecorator = require('./eventEmitterDecorator');
const { DELETE_RECIPE } = require('./events');
const UserModel = require('./userModel');

const removeFromAllCollections = async recipeId => {
  try {
    await UserModel.updateMany({}, { $pull: { recipes: recipeId } });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  load() {
    eventEmitterDecorator.subscribe(DELETE_RECIPE, removeFromAllCollections);
  }
};
