const formatNumber = require('./formatNumber');

module.exports = {
  getAmountWhenFoundInFridge(fridgeIngredient, defaultUnitAmount) {
    if (fridgeIngredient.remainingAmount - defaultUnitAmount >= 0) {
      return defaultUnitAmount;
    }
    return formatNumber(defaultUnitAmount - fridgeIngredient.remainingAmount);
  },

  getAmountWhenNotFoundInFridge(groceryItem, defaultUnitAmount) {
    if (!groceryItem.isCompleted) {
      return formatNumber(groceryItem.amount + defaultUnitAmount);
    }
    return defaultUnitAmount;
  },

  isAmountAvailableInFridge(fridgeIngredient, defaultUnitAmount) {
    return (
      formatNumber(fridgeIngredient.remainingAmount - defaultUnitAmount) >= 0
    );
  },

  getAmountWhenFoundInGroceryList(groceryItem, defaultAmount) {
    if (!groceryItem.isCompleted) {
      return formatNumber(defaultAmount - groceryItem.amount);
    }
    return defaultAmount;
  },

  isIngredientAvailable(fridgeIngredient) {
    return fridgeIngredient.remainingAmount >= 0;
  },

  getAmountWhenSavedInFridge(fridgeIngredient, groceryItem) {
    if (this.isIngredientAvailable(fridgeIngredient)) {
      return groceryItem.amount;
    }
    return Math.abs(fridgeIngredient.remainingAmount);
  },

  getAmountWhenSavedInGroceryList(groceryItem, fridgeIngredient) {
    if (groceryItem.isCompleted) {
      return formatNumber(
        fridgeIngredient.remainingAmount - groceryItem.amount
      );
    }
    return -1 * groceryItem.amount;
  }
};
