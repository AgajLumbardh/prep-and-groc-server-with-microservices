class AuthenticationError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.name = 'AuthenticationError';
    this.status = 401;
    this.isOperational = true;
  }
}
module.exports = AuthenticationError;
