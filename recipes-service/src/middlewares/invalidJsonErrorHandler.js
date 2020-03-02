const ClientError = require('../errors/ClientError');

const isInvalidJsonError = error => error.type === 'entity.parse.failed';

module.exports = (error, req, res, next) => {
  if (isInvalidJsonError(error)) {
    res.status(error.status);
    res.send({ error: true, message: error.message, name: ClientError.name });
  } else {
    next(error);
  }
};
