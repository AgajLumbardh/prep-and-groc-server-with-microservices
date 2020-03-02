const ValueError = require('../errors/ValueError');
const convertUnitToDefaultUnit = require('../utils/convertUnitToDefaultUnit');

const areUnitsEqual = (unitOne, unitTwo) => unitOne === unitTwo;

const isIngredientUnitValidWhenFoundInGroceryList = (
  groceryItem,
  ingredientUnit
) => {
  if (groceryItem.isCompleted) {
    return true;
  }
  return areUnitsEqual(groceryItem.unit, ingredientUnit);
};

module.exports = ({ user, body }, res, next) => {
  const groceryItem = user.findGroceryItem(body.name);
  const defaultIngredientUnit = convertUnitToDefaultUnit(body.unit);
  if (
    groceryItem &&
    !isIngredientUnitValidWhenFoundInGroceryList(
      groceryItem,
      defaultIngredientUnit
    )
  ) {
    next(
      new ValueError(
        `Fridge ingredient unit cannot be converted to the same ingredient unit (${groceryItem.unit}) found in grocery list`
      )
    );
  } else {
    next();
  }
};
