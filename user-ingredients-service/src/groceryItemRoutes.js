const express = require('express');
const groceryItemController = require('./groceryItemController');
const validateGroceryItemsMiddleware = require('./middlewares/validateGroceryItems');
const validateIngredientsUnitConversionMiddleware = require('./middlewares/validateIngredientsUnitConversion');
const validateObjectIdParameterMiddleware = require('./middlewares/validateObjectIdParameter');
const validateDuplicateIngredients = require('./middlewares/validateDuplicateIngredients');
const asyncRoute = require('./utils/asyncRoute');

const router = new express.Router();
router.param('id', validateObjectIdParameterMiddleware);

router.get('/grocery/items', asyncRoute(groceryItemController.list));
router.post(
  '/grocery/items/save-or-update-many',
  validateDuplicateIngredients,
  validateGroceryItemsMiddleware,
  validateIngredientsUnitConversionMiddleware,
  asyncRoute(groceryItemController.saveOrUpdateMany)
);
router.put(
  '/grocery/items/mark-complete/:id',
  asyncRoute(groceryItemController.markComplete)
);
router.delete('/grocery/items/:id', asyncRoute(groceryItemController.delete));

module.exports = router;
