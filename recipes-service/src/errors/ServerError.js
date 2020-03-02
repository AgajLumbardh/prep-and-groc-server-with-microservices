class ServerError extends Error {
  constructor() {
    super();
    this.name = 'ServerError';
    this.message = 'Unknown server error occured. Please try again later.';
    this.status = 500;
    this.isOperational = false;
  }
}

module.exports = ServerError;
