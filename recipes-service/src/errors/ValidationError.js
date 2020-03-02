const formatSchemaValidationErrors = errors => {
  const errorInner = errors.inner;
  const uniqueErrorKeys = {};
  errorInner.forEach(element => {
    if (!uniqueErrorKeys[element.path]) {
      uniqueErrorKeys[element.path] = element.message;
    }
  });
  return uniqueErrorKeys;
};

const isSchemaValidationError = error =>
  error.name === 'ValidationError' && error.inner;

const formatValidationErrors = errors => {
  if (isSchemaValidationError(errors)) {
    return formatSchemaValidationErrors(errors);
  }
  return errors;
};

class ValidationError extends Error {
  constructor(errors) {
    super();
    this.name = 'ValidationError';
    this.message = 'Validation error occured.';
    this.errors = formatValidationErrors(errors);
    this.status = 400;
    this.isOperational = true;
  }
}

module.exports = ValidationError;
