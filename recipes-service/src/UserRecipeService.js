const mongoose = require('mongoose');
const UserModel = require('./userModel');
const ObjectNotFoundError = require('./errors/ObjectNotFoundError');
const ClientError = require('./errors/ClientError');

class UserRecipeService {
  constructor(user) {
    this.user = user;
  }

  isRecipeAdded(objectId) {
    return this.user.recipes.find(
      _id => _id.toString() === objectId.toString()
    );
  }

  isRecipeOwner(userObjectId) {
    return this.user._id.toString() === userObjectId.toString();
  }

  async removeFromCollection(recipe) {
    if (this.isRecipeOwner(recipe.owner)) {
      throw new ClientError('Owned recipes cannot be removed from collection.');
    }
    if (!this.isRecipeAdded(recipe._id)) {
      throw new ObjectNotFoundError(
        `Recipe with id ${recipe._id} was not found in your recipes collection`
      );
    }
    this.user.recipes.pull(recipe._id);
    await this.user.save();
  }

  async addToCollection(recipe) {
    if (this.isRecipeOwner(recipe.owner)) {
      throw new ClientError('Owned recipes are already added to collection.');
    }
    if (this.isRecipeAdded(recipe._id)) {
      throw new ClientError(
        `Recipe with id ${recipe._id} has already been added to collection`
      );
    }
    this.user.recipes.push(recipe._id);
    await this.user.save();
    return recipe;
  }

  async getCollection(query, skipPages, itemsPerPage) {
    return UserModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(this.user._id)
        }
      },
      {
        $lookup: {
          from: 'recipes',
          localField: 'recipes',
          foreignField: '_id',
          as: 'recipes'
        }
      },
      { $unwind: '$recipes' },
      {
        $addFields: {
          isOwner: { $eq: ['$recipes.owner', this.user._id] },
          isSaved: true
        }
      },
      {
        $project: {
          _id: '$recipes._id',
          title: '$recipes.title',
          owner: '$recipes.owner',
          category: '$recipes.category',
          imageUrl: '$recipes.imageUrl',
          area: '$recipes.area',
          isOwner: 1,
          isSaved: 1
        }
      },
      { $match: { ...query } },
      { $skip: skipPages },
      { $limit: itemsPerPage }
    ]);
  }

  async count(query) {
    const countedUserRecipes = await UserModel.aggregate([
      {
        $match: {
          _id: this.user._id
        }
      },
      {
        $lookup: {
          from: 'recipes',
          localField: 'recipes',
          foreignField: '_id',
          as: 'recipes'
        }
      },
      { $unwind: '$recipes' },
      {
        $addFields: {
          isOwner: { $eq: ['$recipes.owner', this.user._id] }
        }
      },
      {
        $project: {
          _id: '$recipes._id',
          title: '$recipes.title',
          isOwner: 1
        }
      },
      { $match: { ...query } },
      { $count: 'totalItems' }
    ]);
    return countedUserRecipes.length > 0 ? countedUserRecipes[0].totalItems : 0;
  }
}

module.exports = UserRecipeService;
