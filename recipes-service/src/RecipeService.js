const mongoose = require('mongoose');
const RecipeModel = require('./recipeModel');
const ObjectNotFoundError = require('./errors/ObjectNotFoundError');
const ClientError = require('./errors/ClientError');
const convertAmountToDefaultUnitAmount = require('./utils/convertAmountToDefaultUnitAmount');
const convertUnitToDefaultUnit = require('./utils/convertUnitToDefaultUnit');
const formatNumber = require('./utils/formatNumber');
const eventEmitterDecorator = require('./eventEmitterDecorator');
const { DELETE_RECIPE } = require('./events');

const isIngredientAmountAvailableInFridge = (fridgeIngredient, amount) =>
  formatNumber(fridgeIngredient.remainingAmount - amount) >= 0;

class RecipeService {
  constructor(user) {
    this.user = user;
  }

  async isAdded(recipeObjectId) {
    return this.user.recipes.find(
      recipeId => recipeId.toString() === recipeObjectId.toString()
    );
  }

  async save(recipe) {
    const isRecipeSaved = await RecipeModel.findOne({
      owner: this.user.id,
      title: recipe.title
    });
    if (isRecipeSaved) {
      throw new ClientError('Recipe is already saved');
    }
    const newRecipe = await RecipeModel.create({
      ...recipe,
      _id: mongoose.Types.ObjectId(),
      owner: this.user._id
    });
    this.user.recipes.push(newRecipe._id);
    await this.user.save();
    return newRecipe;
  }

  async delete(id) {
    const deletedRecipe = await RecipeModel.findOneAndDelete({
      _id: mongoose.Types.ObjectId(id),
      owner: this.user._id
    });
    if (!deletedRecipe) {
      throw new ObjectNotFoundError(`Recipe with id:${id} could not be found.`);
    }
    eventEmitterDecorator.publish(DELETE_RECIPE, id);
  }

  async get(id) {
    const userSavedRecipes = (this.user && this.user.recipes) || [];
    const userId = this.user && this.user._id;
    const result = await RecipeModel.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(id) }
      },
      {
        $addFields: {
          isSaved: { $in: ['$_id', userSavedRecipes] },
          isOwner: { $eq: ['$owner', userId] }
        }
      }
    ]);
    if (result && result.length === 0) {
      throw new ObjectNotFoundError('Recipe could not be found');
    }
    const recipe = await RecipeModel.populate(result, {
      path: 'owner',
      select: 'firstName lastName'
    });
    return recipe[0];
  }

  async list(query, sortType, skipPages, itemsPerPage) {
    const match = { ...query };
    const userRecipes = (this.user && this.user.recipes) || [];
    if (this.user) {
      match.owner = { $ne: this.user._id };
    }
    return RecipeModel.aggregate([
      {
        $match: { ...match }
      },
      {
        $addFields: {
          isSaved: { $in: ['$_id', userRecipes] }
        }
      },
      {
        $project: {
          title: '$title',
          owner: '$owner',
          category: '$category',
          imageUrl: '$imageUrl',
          area: '$area',
          isSaved: '$isSaved'
        }
      },
      { $sort: sortType },
      { $skip: skipPages },
      { $limit: itemsPerPage }
    ]);
  }

  count(query) {
    return RecipeModel.find(query).countDocuments();
  }

  getIngredientsAvailability(recipe) {
    if (!this.isAdded(recipe._id)) {
      throw new ObjectNotFoundError(
        `Recipe with id ${recipe._id} was not found in your recipes collection`
      );
    }
    return recipe.ingredients.map(ingredient => {
      const item = {
        _id: mongoose.Types.ObjectId().toString(),
        name: ingredient.name,
        amount: convertAmountToDefaultUnitAmount(ingredient),
        unit: convertUnitToDefaultUnit(ingredient.unit),
        remainingAmount: 0,
        isCompleted: false
      };
      const fridgeIngredient = this.user.findFridgeIngredient(item.name);
      if (fridgeIngredient) {
        item.remainingAmount = fridgeIngredient.remainingAmount;
        item.isCompleted = isIngredientAmountAvailableInFridge(
          fridgeIngredient,
          item.amount
        );
      }
      return item;
    });
  }
}

module.exports = RecipeService;
