class ClientError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.name = 'ClientError';
    this.status = 400;
    this.isOperational = true;
  }
}

module.exports = ClientError;
