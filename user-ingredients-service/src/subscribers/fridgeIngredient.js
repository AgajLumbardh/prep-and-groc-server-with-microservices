/* eslint-disable no-console */
const eventEmitterDecorator = require('../eventEmitterDecorator');
const { SAVE_FRIDGE_INGREDIENT_EVENT } = require('./events');
const UserModel = require('../userModel');
const ingredientAmountHelper = require('../utils/ingredientAmountHelper');

const updateGroceryItemIfFound = async ({ userId, fridgeIngredient }) => {
  try {
    const user = await UserModel.findById(userId);
    const groceryItem = user.findGroceryItem(fridgeIngredient.name);
    if (groceryItem && !groceryItem.isCompleted) {
      groceryItem.amount = ingredientAmountHelper.getAmountWhenSavedInFridge(
        fridgeIngredient,
        groceryItem
      );
      groceryItem.isCompleted = ingredientAmountHelper.isIngredientAvailable(
        fridgeIngredient
      );
    }
    await user.save();
  } catch (error) {
    console.error(error);
  }
};

module.exports = () => {
  eventEmitterDecorator.subscribe(
    SAVE_FRIDGE_INGREDIENT_EVENT,
    updateGroceryItemIfFound
  );
};
