const {
  SaveRecipeSchemaWithIngredients
} = require('@bit/agajlumbardh.prep-and-groc-validators.recipe');
const ValidationError = require('../errors/ValidationError');

module.exports = (req, res, next) => {
  SaveRecipeSchemaWithIngredients.validate(req.body, { abortEarly: false })
    .then(() => next())
    .catch(error => next(new ValidationError(error)));
};
