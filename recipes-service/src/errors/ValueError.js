class ValueError extends Error {
  constructor(value) {
    super();
    if (Array.isArray(value)) {
      this.errors = value;
    } else {
      this.message = value;
    }
    this.name = 'ValueError';
    this.status = 400;
    this.isOperational = true;
  }
}

module.exports = ValueError;
