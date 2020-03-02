const ValueError = require('../errors/ValueError');
const convertUnitToDefaultUnit = require('../utils/convertUnitToDefaultUnit');

module.exports = (req, res, next) => {
  const valueErrors = [];
  req.body.ingredients.forEach(ingredient => {
    try {
      convertUnitToDefaultUnit(ingredient.unit);
    } catch (error) {
      if (error instanceof ValueError) {
        valueErrors.push(
          `${error.message} for '${ingredient.name}' ingredient`
        );
      } else {
        next(error);
      }
    }
  });
  if (valueErrors.length > 0) {
    next(new ValueError(valueErrors));
  } else {
    next();
  }
};
