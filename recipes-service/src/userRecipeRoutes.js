const express = require('express');
const userRecipeController = require('./userRecipeController');
const attachUserMiddleware = require('./middlewares/attachUser');
const attachRecipeMiddleware = require('./middlewares/attachRecipe');
const validateObjectIdParameterMiddleware = require('./middlewares/validateObjectIdParameter');
const asyncRoute = require('./utils/asyncRoute');

const router = new express.Router();
router.param('id', validateObjectIdParameterMiddleware);

router.get(
  '/user/recipes',
  attachUserMiddleware,
  asyncRoute(userRecipeController.list)
);

router.put(
  '/user/recipes/:id',
  attachUserMiddleware,
  attachRecipeMiddleware,
  asyncRoute(userRecipeController.add)
);

router.delete(
  '/user/recipes/:id',
  attachUserMiddleware,
  attachRecipeMiddleware,
  asyncRoute(userRecipeController.remove)
);

module.exports = router;
