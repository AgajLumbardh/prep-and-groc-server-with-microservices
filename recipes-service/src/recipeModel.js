const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  ingredients: [
    {
      name: String,
      amount: Number,
      unit: String,
      unitShort: String,
      unitLong: String,
      originalString: String,
      meta: String
    }
  ],
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  instructions: {
    type: String,
    required: true
  },
  area: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const recipeModel = mongoose.model('Recipe', recipeSchema);

module.exports = recipeModel;
