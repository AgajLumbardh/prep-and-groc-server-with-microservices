const SaveFridgeIngredientSchema = require('@bit/agajlumbardh.prep-and-groc-validators.fridge');
const ValidationError = require('../errors/ValidationError');

module.exports = (req, res, next) => {
  SaveFridgeIngredientSchema.validate(req.body, { abortEarly: false })
    .then(() => next())
    .catch(error => next(new ValidationError(error)));
};
