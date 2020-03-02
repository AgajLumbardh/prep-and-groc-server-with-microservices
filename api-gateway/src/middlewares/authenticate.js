const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AuthenticationError = require('../errors/AuthenticationError');
const { JWT_SECRET_KEY } = require('../config/constants');

const promisifedVerify = promisify(jwt.verify);

const hasAuthToken = request => request.cookies && request.cookies.auth;

const getAuthenticatedSubject = req =>
  promisifedVerify(req.cookies.auth, JWT_SECRET_KEY);

const authenticate = async (req, res, next) => {
  if (hasAuthToken(req)) {
    getAuthenticatedSubject(req)
      .then(tokenSubject => {
        req.subject = tokenSubject;
        next();
      })
      .catch(error => next(error));
  } else {
    next(
      new AuthenticationError('Unauthorized user:token was not found.', 401)
    );
  }
};

module.exports = authenticate;
