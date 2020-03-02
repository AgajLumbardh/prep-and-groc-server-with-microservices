class ObjectNotFoundError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.name = 'ObjectNotFoundError';
    this.status = 400;
    this.isOperational = true;
  }
}
module.exports = ObjectNotFoundError;
