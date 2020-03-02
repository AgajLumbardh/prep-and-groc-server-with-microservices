const ValidationError = require('../errors/ValidationError');

module.exports = (req, res, next) => {
  const uniqueIngredients = [];
  const validationErrors = [];
  const ingredients = req.body.ingredients || req.body;
  ingredients.forEach(ingredient => {
    if (uniqueIngredients.includes(ingredient.name)) {
      validationErrors.push({
        name: `ingredient(${ingredient.name}) is duplicated`
      });
    }
    uniqueIngredients.push(ingredient.name);
  });

  if (validationErrors.length > 0) {
    next(new ValidationError(validationErrors));
  } else {
    next();
  }
};
