const express = require('express');
const userController = require('./userController');
const attachUserMiddleware = require('./middlewares/attachUser');
const validateLoginCredentialsMiddleware = require('./middlewares/validateLoginCredentials');
const validateUserMiddleware = require('./middlewares/validateUser');
const asyncRoute = require('./utils/asyncRoute');

const router = new express.Router();

router.post(
  '/users/signup',
  validateUserMiddleware,
  asyncRoute(userController.signup)
);
router.post(
  '/users/login',
  validateLoginCredentialsMiddleware,
  asyncRoute(userController.login)
);
router.post(
  '/users/logout',
  attachUserMiddleware,
  asyncRoute(userController.logout)
);
router.get(
  '/users/me',
  attachUserMiddleware,
  asyncRoute(userController.authenticatedUser)
);

module.exports = router;
