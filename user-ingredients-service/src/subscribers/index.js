const fridgeIngredientSubscribers = require('./fridgeIngredient');
const groceryItemSubscribers = require('./groceryItem');

module.exports = {
  load() {
    fridgeIngredientSubscribers();
    groceryItemSubscribers();
  }
};
