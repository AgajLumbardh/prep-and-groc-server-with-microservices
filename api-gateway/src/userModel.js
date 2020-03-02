const mongoose = require('mongoose');

const fridgeIngredientSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  remainingAmount: { type: Number, required: true },
  meta: { type: String },
  originalAmount: Number,
  originalUnit: String,
  amountDifference: { type: Number }
});

const groceryItemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  unit: { type: String, required: true },
  isCompleted: { type: Boolean, default: false, required: true },
  meta: { type: String }
});

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  fridge: [fridgeIngredientSchema],

  groceries: [groceryItemSchema],

  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],

  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('User', userSchema);
