const ValueError = require('../errors/ValueError');
const convertUnitToDefaultUnit = require('../utils/convertUnitToDefaultUnit');

const areUnitsEqual = (firstIngredient, secondIngredient) => {
  const defaultFirstIngredientUnit = convertUnitToDefaultUnit(
    firstIngredient.unit
  );
  const defaultSecondIngredientUnit = convertUnitToDefaultUnit(
    secondIngredient.unit
  );
  return defaultFirstIngredientUnit === defaultSecondIngredientUnit;
};

const validateIngredientUnitInFridge = (ingredient, fridgeIngredient) => {
  if (fridgeIngredient) {
    if (!areUnitsEqual(ingredient, fridgeIngredient)) {
      throw new ValueError({
        _id: fridgeIngredient._id,
        ingredient: ingredient.name,
        message: `recipe ingredient unit(${ingredient.unit}) cannot be converted
         to ingredient unit(${fridgeIngredient.unit}) found in fridge`
      });
    }
  }
};

const validateIngredientUnitInGroceryList = (ingredient, groceryItem) => {
  if (groceryItem) {
    if (!areUnitsEqual(ingredient, groceryItem)) {
      throw new ValueError({
        _id: groceryItem._id,
        ingredient: ingredient.name,
        message: `recipe ingredient unit(${ingredient.unit}) cannot be converted
         to ingredient unit(${groceryItem.unit}) found in grocery list`
      });
    }
  }
};

module.exports = ({ user, recipe }, res, next) => {
  const valueErrors = [];
  recipe.ingredients.forEach(ingredient => {
    try {
      validateIngredientUnitInFridge(
        ingredient,
        user.findFridgeIngredient(ingredient.name)
      );
      validateIngredientUnitInGroceryList(
        ingredient,
        user.findGroceryItem(ingredient.name)
      );
    } catch (error) {
      if (error instanceof ValueError) {
        valueErrors.push(error.message);
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
