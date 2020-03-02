const express = require('express');

const router = express.Router();
const cookieParser = require('cookie-parser');
const authenticateMiddleware = require('./middlewares/authenticate');
const { usersProxy, recipesProxy, userIngredientsProxy } = require('./proxies');

// Unauthenticated routes
router.post('/users/login', usersProxy);
router.post('/users/signup', usersProxy);
router.get('/recipes', cookieParser(), recipesProxy);
router.get('/recipes/:id', cookieParser(), recipesProxy);
router.get('/ingredients', recipesProxy);

// Authenticated routes
router.use(
  ['/users/logout', '/users/me'],
  cookieParser(),
  authenticateMiddleware,
  usersProxy
);
router.use(
  ['/fridge/**', '/grocery/**'],
  cookieParser(),
  authenticateMiddleware,
  userIngredientsProxy
);
router.use(
  ['/recipes**', '/user/recipes**'],
  cookieParser(),
  authenticateMiddleware,
  recipesProxy
);

module.exports = router;
