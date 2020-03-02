const mongoose = require('mongoose');
const RecipeModel = require('../../recipeModel');
const UserModel = require('../../userModel');

const saveRecipe = (recipe, ownerId) => {
  const newRecipe = new RecipeModel({ ...recipe, owner: ownerId });
  return newRecipe.save();
};

const deleteRecipe = title => RecipeModel.findOneAndDelete({ title });

const addRecipeToUserCollection = (recipeId, userId) =>
  UserModel.findByIdAndUpdate(mongoose.Types.ObjectId(userId), {
    $push: { recipes: mongoose.Types.ObjectId(recipeId) }
  });

const removeRecipeFromUserCollection = (recipeId, userId) =>
  UserModel.findByIdAndUpdate(mongoose.Types.ObjectId(userId), {
    $pull: { recipes: mongoose.Types.ObjectId(recipeId) }
  });

module.exports = {
  saveRecipe,
  deleteRecipe,
  addRecipeToUserCollection,
  removeRecipeFromUserCollection
};
