const mongoose = require('mongoose');

const incompleteGroceryItem = {
  _id: mongoose.Types.ObjectId().toString(),
  name: 'Smoked Salmon',
  amount: 1000,
  unit: 'gr',
  isCompleted: false,
  remainingAmount: -1000,
  amountDifference: -1000
};

const completeGroceryItem = {
  _id: mongoose.Types.ObjectId().toString(),
  name: 'Basil leaves',
  amount: 200,
  unit: 'gr',
  isCompleted: true,
  remainingAmount: 300,
  amountDifference: 100
};

const invalidGroceryItem = [
  {
    name: 123,
    amount: 'sdf!',
    unit: 123,
    isCompleted: 14
  }
];

const groceryItems = [completeGroceryItem, incompleteGroceryItem];

const GROCERY_ITEM_ID = mongoose.Types.ObjectId().toString();
const INVALID_GROCERY_ITEM_ID = '1kmlf1';

module.exports = {
  incompleteGroceryItem,
  completeGroceryItem,
  invalidGroceryItem,
  groceryItems,
  GROCERY_ITEM_ID,
  INVALID_GROCERY_ITEM_ID
};
