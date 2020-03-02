const mongoose = require('mongoose');
const UserModel = require('./userModel');
const ValidationError = require('./errors/ValidationError');
const ObjectNotFoundError = require('./errors/ObjectNotFoundError');
const convertAmountToDefaultUnitAmount = require('./utils/convertAmountToDefaultUnitAmount');
const convertUnitToDefaultUnit = require('./utils/convertUnitToDefaultUnit');
const { SAVE_FRIDGE_INGREDIENT_EVENT } = require('./subscribers/events');
const eventEmitterDecorator = require('./eventEmitterDecorator');
const ingredientAmountHelper = require('./utils/ingredientAmountHelper');

class FridgeIngredientService {
  constructor(user) {
    this.user = user;
  }

  getRemainingAmount({ name, amount }) {
    const groceryItem = this.user.findGroceryItem(name);
    if (groceryItem) {
      return ingredientAmountHelper.getAmountWhenFoundInGroceryList(
        groceryItem,
        amount
      );
    }
    return amount;
  }

  async save(ingredient) {
    if (this.user.findFridgeIngredient(ingredient.name)) {
      throw new ValidationError({ name: 'Fridge ingredient already exists' });
    }
    const newIngredient = {
      ...ingredient,
      _id: mongoose.Types.ObjectId()
    };
    newIngredient.originalUnit = newIngredient.unit;
    newIngredient.originalAmount = newIngredient.amount;
    newIngredient.amount = convertAmountToDefaultUnitAmount(newIngredient);
    newIngredient.unit = convertUnitToDefaultUnit(newIngredient.unit);
    newIngredient.remainingAmount = this.getRemainingAmount(newIngredient);
    this.user.fridge.push(newIngredient);
    await this.user.save();
    eventEmitterDecorator.publish(SAVE_FRIDGE_INGREDIENT_EVENT, {
      userId: this.user._id,
      fridgeIngredient: newIngredient
    });
    return newIngredient;
  }

  async count(query) {
    const result = await UserModel.aggregate([
      {
        $match: {
          _id: this.user._id
        }
      },
      { $unwind: '$fridge' },
      { $match: { ...query } },
      { $count: 'totalItems' }
    ]);
    return result.length > 0 ? result[0].totalItems : 0;
  }

  async list(query, skipPages, itemsPerPage) {
    return UserModel.aggregate([
      {
        $match: {
          _id: this.user._id
        }
      },
      { $unwind: '$fridge' },
      {
        $project: {
          _id: '$fridge._id',
          name: '$fridge.name',
          amount: '$fridge.amount',
          remainingAmount: '$fridge.remainingAmount',
          unit: '$fridge.unit'
        }
      },
      { $match: { ...query } },
      { $skip: skipPages },
      { $limit: itemsPerPage }
    ]);
  }

  async delete(ingredientId) {
    const ingredient = this.user.fridge.id(ingredientId);
    if (!ingredient) {
      throw new ObjectNotFoundError(
        `Fridge item with id:${ingredientId} was not found`
      );
    }
    ingredient.remove();
    await this.user.save();
  }
}

module.exports = FridgeIngredientService;
