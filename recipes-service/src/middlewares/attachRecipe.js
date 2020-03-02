const RecipeModel = require('../recipeModel');
const ObjectNotFoundError = require('../errors/ObjectNotFoundError');

module.exports = (req, res, next) => {
  RecipeModel.findById(req.params.id)
    .then(recipe => {
      if (recipe) {
        req.recipe = recipe;
        next();
      } else {
        next(
          new ObjectNotFoundError(
            `Recipe with id:${req.params.id} could not be found.`
          )
        );
      }
    })
    .catch(error => next(error));
};
