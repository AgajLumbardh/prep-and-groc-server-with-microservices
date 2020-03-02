const mongoose = require('mongoose');

const recipe = {
  _id: mongoose.Types.ObjectId().toString(),
  title: 'Massaman Beef curry',
  category: 'Beef',
  area: 'Thai',
  instructions: `Heat oven to 200C/180C fan/gas 6, then roast the peanuts on a baking tray for 5 mins 
    until golden brown. When cool enough to handle, roughly chop. Reduce oven to 180C/160C 
    fan/gas 4.Heat 2 tbsp coconut cream in a large casserole dish with a lid. Add the curry 
    paste and fry for 1 min, then stir in the beef and fry until well coated and sealed. 
    Stir in the rest of the coconut with half a can of water, the potatoes, onion, lime 
    leaves, cinnamon, tamarind, sugar, fish sauce and most of the peanuts. Bring to a simmer, 
    then cover and cook for 2 hrs in the oven until the beef is tender.Sprinkle with sliced 
    chilli and the remaining peanuts, then serve straight from the dish with jasmine rice.`,
  ingredients: [
    {
      name: 'Peanuts',
      amount: 85,
      unit: 'gr',
      unitShort: 'gr',
      unitLong: 'gram',
      originalString: '85g Peanuts'
    },
    {
      name: 'Coconut cream',
      amount: 400,
      unit: 'ml',
      unitShort: 'ml',
      unitLong: 'milliliter',
      meta: 'can',
      originalString: '400ml can Coconut cream'
    },
    {
      name: 'Massaman curry paste',
      amount: 4,
      unit: 'tbsp',
      unitShort: 'tbsp',
      unitLong: 'tablespoon',
      originalString: '4 tbsp Massaman curry paste'
    },
    {
      name: 'Beef',
      amount: 600,
      unit: 'gr',
      unitShort: 'gr',
      unitLong: 'gram',
      meta: 'stewing',
      originalString: '600g stewing cut into strips Beef'
    },
    {
      name: 'Potatoes',
      amount: 450,
      unit: 'gr',
      unitShort: 'gr',
      unitLong: 'gram',
      meta: 'waxy',
      originalString: '450g waxy Potatoes'
    },
    {
      name: 'Onion',
      amount: 1,
      unit: 'piece',
      meta: 'cut thin wedges',
      originalString: '1 cut thin wedges Onion'
    },
    {
      name: 'Lime',
      amount: 4,
      unit: 'piece',
      meta: 'leaves',
      originalString: '4 leaves Lime'
    },
    {
      name: 'Cinnamon stick',
      amount: 1,
      unit: 'piece',
      unitShort: 'piece',
      unitLong: 'piece',
      originalString: '1 Cinnamon stick'
    },
    {
      name: 'Tamarind paste',
      amount: 1,
      unit: 'tbsp',
      unitShort: 'tbsp',
      unitLong: 'tablespoon',
      originalString: '1 tbsp Tamarind paste'
    },
    {
      name: 'Brown sugar',
      amount: 1,
      unit: 'tbsp',
      unitShort: 'tbsp',
      unitLong: 'tablespoon',
      meta: 'palm',
      originalString: '1 tbsp palm or soft light Brown sugar'
    },
    {
      name: 'Fish Sauce',
      amount: 1,
      unit: 'tbsp',
      unitShort: 'tbsp',
      unitLong: 'tablespoon',
      originalString: '1 tbsp Fish Sauce'
    }
  ],
  imageUrl: 'https://www.themealdb.com/images/media/meals/tvttqv1504640475.jpg'
};

const availableRecipeIngredient = {
  _id: mongoose.Types.ObjectId().toString(),
  name: 'Beef',
  amount: 1200,
  remainingAmount: 1200,
  unit: 'gr',
  unitShort: 'gr',
  unitLong: 'gram',
  meta: 'stewing',
  originalString: '600g stewing cut into strips Beef'
};

const unavailableRecipeIngredient = {
  _id: mongoose.Types.ObjectId().toString(),
  name: 'Peanuts',
  amount: 40,
  remainingAmount: 40,
  unit: 'gr',
  unitShort: 'gr',
  unitLong: 'gram',
  originalString: '85g Peanuts'
};

const recipeWithDuplicateIngredients = {
  _id: mongoose.Types.ObjectId().toString(),
  title: 'Beef Bourguignon',
  category: 'Beef',
  area: 'French',
  instructions: `Heat a large casserole pan and add 1 tbsp goose fat. Season the beef and fry until golden brown, 
    about 3-5 mins, then turn over and fry the other side until the meat is browned all over, 
    adding more fat if necessary. Do this in 2-3 batches, transferring the meat to a colander 
    set over a bowl when browned.In the same pan, fry the bacon, shallots or pearl onions,
     mushrooms, garlic and bouquet garni until lightly browned. Mix in the tomato purée 
     and cook for a few mins, stirring into the mixture. This enriches the bourguignon 
     and makes a great base for the stew. Then return the beef and any drained juices to the pan 
     and stir through.`,
  ingredients: [
    {
      name: 'rice',
      amount: 100,
      unit: 'gr',
      meta: 'sushi rice'
    },
    {
      name: 'rice',
      amount: 100,
      unit: 'gr',
      meta: 'sushi rice'
    }
  ],
  imageUrl: 'https://www.themealdb.com/images/media/meals/vtqxtu1511784197.jpg'
};

const invalidRecipe = {
  title: 1233,
  category: 'Breakfast',
  area: 0.455543,
  instructions: '',
  ingredients: [
    {
      name: 'rice',
      amount: 100,
      unit: 'gr',
      meta: 'sushi rice'
    }
  ],
  imageUrl: 'htt://images.japancentre.com/recipes/pics/18/main/makisushi.jpg'
};

const RECIPE_ID = mongoose.Types.ObjectId().toString();

const INVALID_RECIPE_ID = 'km111';

module.exports = {
  recipe,
  availableRecipeIngredient,
  unavailableRecipeIngredient,
  invalidRecipe,
  recipeWithDuplicateIngredients,
  INVALID_RECIPE_ID,
  RECIPE_ID
};
