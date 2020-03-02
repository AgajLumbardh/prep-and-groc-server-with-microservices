const mongoose = require('mongoose');

const ingredientSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

const ingredientModel = mongoose.model('Ingredient', ingredientSchema);

module.exports = ingredientModel;
