/* eslint-disable no-console */
const eventEmitterDecorator = require('../eventEmitterDecorator');
const {
  SAVE_OR_UPDATE_MANY_GROCERY_ITEMS_EVENT,
  MARK_COMPLETE_GROCERY_ITEM_EVENT
} = require('./events');
const UserModel = require('../userModel');
const ingredientAmountHelper = require('../utils/ingredientAmountHelper');

const updateManyFridgeIngredientsRemainingAmount = async ({
  userId,
  items
}) => {
  try {
    const user = await UserModel.findById(userId);
    items.forEach(item => {
      const fridgeIngredient = user.findFridgeIngredient(item.name);
      if (fridgeIngredient) {
        fridgeIngredient.remainingAmount = ingredientAmountHelper.getAmountWhenSavedInGroceryList(
          item,
          fridgeIngredient
        );
      }
    });
    await user.save();
  } catch (error) {
    console.error(error);
  }
};

const deleteFridgeIngredient = async ({ userId, item }) => {
  try {
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { fridge: { name: item.name } }
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = () => {
  eventEmitterDecorator.subscribe(
    SAVE_OR_UPDATE_MANY_GROCERY_ITEMS_EVENT,
    updateManyFridgeIngredientsRemainingAmount
  );

  eventEmitterDecorator.subscribe(
    MARK_COMPLETE_GROCERY_ITEM_EVENT,
    deleteFridgeIngredient
  );
};
