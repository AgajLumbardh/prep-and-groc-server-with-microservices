const express = require('express');
const fridgeIngredientController = require('./fridgeIngredientController');
const validateObjectIdParameterMiddleware = require('./middlewares/validateObjectIdParameter');
const validateFridgeIngredientMiddleware = require('./middlewares/validateFridgeIngredient');
const validateFridgeIngredientUnitConversionMiddleware = require('./middlewares/validateFridgeIngredientUnitConversion');

const asyncRoute = require('./utils/asyncRoute');

const router = new express.Router();
router.param('id', validateObjectIdParameterMiddleware);

router.get('/fridge/ingredients', asyncRoute(fridgeIngredientController.list));
router.post(
  '/fridge/ingredients',
  validateFridgeIngredientMiddleware,
  validateFridgeIngredientUnitConversionMiddleware,
  asyncRoute(fridgeIngredientController.save)
);
router.delete(
  '/fridge/ingredients/:id',
  asyncRoute(fridgeIngredientController.delete)
);

module.exports = router;
