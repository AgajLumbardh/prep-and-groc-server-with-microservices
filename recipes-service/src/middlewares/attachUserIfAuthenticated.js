const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const getUser = require('../utils/getUser');
const {JWT_SECRET_KEY} = require('../config/constants');

const promisifedVerify = promisify(jwt.verify);

const hasAuthToken = request => request.cookies && request.cookies.auth;

const getAuthenticatedSubject = req =>
  promisifedVerify(req.cookies.auth, JWT_SECRET_KEY);

module.exports = async (req, res, next) => {
  if (hasAuthToken(req)) {
    getAuthenticatedSubject(req)
      .then(tokenSubject => getUser(tokenSubject.id))
      .then(user => {
        req.user = user;
        next();
      })
      .catch(error => next(error));
  } else {
    next();
  }
};
