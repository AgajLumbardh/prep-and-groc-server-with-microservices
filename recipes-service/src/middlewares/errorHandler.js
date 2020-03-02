/* eslint-disable no-console */
const ServerError = require('../errors/ServerError');

const logError = error => console.error(error);

// eslint-disable-next-line no-unused-vars
module.exports = (error, req, res, next) => {
  if (error.isOperational) {
    res.status(error.status);
    res.send({
      error: true,
      ...error,
      status: undefined,
      isOperational: undefined
    });
  } else {
    logError(error);
    res.status(500);
    res.send({
      error: true,
      ...new ServerError(),
      status: undefined,
      isOperational: undefined
    });
  }
};
