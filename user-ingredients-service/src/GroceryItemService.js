const mongoose = require('mongoose');
const UserModel = require('./userModel');
const ClientError = require('./errors/ClientError');
const ObjectNotFoundError = require('./errors/ObjectNotFoundError');
const convertAmountToDefaultUnitAmount = require('./utils/convertAmountToDefaultUnitAmount');
const convertUnitToDefaultUnit = require('./utils/convertUnitToDefaultUnit');
const {
  SAVE_OR_UPDATE_MANY_GROCERY_ITEMS_EVENT,
  MARK_COMPLETE_GROCERY_ITEM_EVENT
} = require('./subscribers/events');
const eventEmitterDecorator = require('./eventEmitterDecorator');
const ingredientAmountHelper = require('./utils/ingredientAmountHelper');

class GroceryItemService {
  constructor(user) {
    this.user = user;
  }

  async list(query, skipPages, itemsPerPage) {
    return UserModel.aggregate([
      {
        $match: {
          _id: this.user._id
        }
      },
      { $unwind: '$groceries' },
      {
        $project: {
          _id: '$groceries._id',
          name: '$groceries.name',
          amount: '$groceries.amount',
          unit: '$groceries.unit',
          isCompleted: '$groceries.isCompleted'
        }
      },
      { $match: { ...query } },
      { $skip: skipPages },
      { $limit: itemsPerPage }
    ]);
  }

  async count(query) {
    const countedListItems = await UserModel.aggregate([
      {
        $match: {
          _id: this.user._id
        }
      },
      { $unwind: '$groceries' },
      { $match: { ...query } },
      { $count: 'totalItems' }
    ]);
    return countedListItems.length > 0 ? countedListItems[0].totalItems : 0;
  }

  async markComplete(groceryItemId) {
    const groceryItem = this.getById(groceryItemId);
    if (!groceryItem) {
      throw new ObjectNotFoundError(
        `Grocery item with id:${groceryItemId} was not found`
      );
    }
    if (groceryItem.isCompleted) {
      return groceryItem;
    }
    groceryItem.isCompleted = true;
    await this.user.save();
    eventEmitterDecorator.publish(MARK_COMPLETE_GROCERY_ITEM_EVENT, {
      userId: this.user._id,
      item: groceryItem
    });
    return groceryItem;
  }

  findByName(name) {
    return this.user.groceries.find(
      item => item.name.toLowerCase() === name.toLowerCase()
    );
  }

  getById(groceryItemId) {
    return this.user.groceries.id(groceryItemId);
  }

  update(item) {
    const groceryItem = this.findByName(item.name);
    const defaultUnitItemAmount = convertAmountToDefaultUnitAmount(item);
    const defaultUnitItem = convertUnitToDefaultUnit(item.unit);
    const fridgeIngredient = this.user.findFridgeIngredient(item.name);
    if (fridgeIngredient) {
      groceryItem.amount = ingredientAmountHelper.getAmountWhenFoundInFridge(
        fridgeIngredient,
        defaultUnitItemAmount
      );
      groceryItem.isCompleted = ingredientAmountHelper.isAmountAvailableInFridge(
        fridgeIngredient,
        defaultUnitItemAmount
      );
    } else {
      groceryItem.amount = ingredientAmountHelper.getAmountWhenNotFoundInFridge(
        groceryItem,
        defaultUnitItemAmount
      );
      groceryItem.isCompleted = false;
    }
    groceryItem.unit = defaultUnitItem;
    return groceryItem;
  }

  save(item) {
    const newItem = {
      ...item,
      _id: mongoose.Types.ObjectId(),
      isCompleted: false
    };
    const defaultUnitItemAmount = convertAmountToDefaultUnitAmount(item);
    newItem.amount = defaultUnitItemAmount;
    newItem.unit = convertUnitToDefaultUnit(item.unit);
    const fridgeIngredient = this.user.findFridgeIngredient(newItem.name);
    if (fridgeIngredient) {
      newItem.amount = ingredientAmountHelper.getAmountWhenFoundInFridge(
        fridgeIngredient,
        defaultUnitItemAmount
      );
      newItem.isCompleted = ingredientAmountHelper.isAmountAvailableInFridge(
        fridgeIngredient,
        defaultUnitItemAmount
      );
    }
    this.user.groceries.push(newItem);
    return newItem;
  }

  async saveOrUpdateMany(items) {
    const newItems = [];
    items.forEach(item => {
      if (this.findByName(item.name)) {
        newItems.push(this.update(item));
      } else {
        newItems.push(this.save(item));
      }
    });
    await this.user.save();
    eventEmitterDecorator.publish(SAVE_OR_UPDATE_MANY_GROCERY_ITEMS_EVENT, {
      userId: this.user._id,
      items: newItems
    });
    return newItems;
  }

  async delete(groceryItemId) {
    const groceryItem = this.getById(groceryItemId);
    if (!groceryItem) {
      throw new ObjectNotFoundError(
        `Grocery item with id:${groceryItemId} is not found`
      );
    }
    if (!groceryItem.isCompleted) {
      throw new ClientError('Incomplete grocery items cannot be deleted.');
    }
    groceryItem.remove();
    await this.user.save();
  }
}

module.exports = GroceryItemService;
