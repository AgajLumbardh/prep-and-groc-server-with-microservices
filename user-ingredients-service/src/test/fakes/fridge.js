const mongoose = require('mongoose');

const fridgeIngredient = {
  _id: mongoose.Types.ObjectId().toString(),
  name: 'Smoked Salmon',
  amount: 1,
  unit: 'kg',
  availableAmount: 1000
};

const fridgeIngredientWithInvalidId = {
  _id: '5cda7f4',
  name: 'smoked salmon',
  amount: 1,
  unit: 'kg'
};

const invalidFridgeIngredient = {
  _id: mongoose.Types.ObjectId().toString(),
  name: 123,
  amount: '2',
  unit: 'unknown'
};

const emptyFridgeIngredient = {};

module.exports = {
  fridgeIngredient,
  fridgeIngredientWithInvalidId,
  invalidFridgeIngredient,
  emptyFridgeIngredient
};
