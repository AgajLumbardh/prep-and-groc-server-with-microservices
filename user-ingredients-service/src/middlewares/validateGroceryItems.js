const SaveGroceryItemsSchema = require('@bit/agajlumbardh.prep-and-groc-validators.grocery');
const ValidationError = require('../errors/ValidationError');

module.exports = (req, res, next) => {
  const items = Array.isArray(req.body) ? req.body : new Array(req.body);
  SaveGroceryItemsSchema.validate(items, { abortEarly: false })
    .then(validatedItems => {
      req.groceryItems = validatedItems;
      next();
    })
    .catch(error => next(new ValidationError(error)));
};
