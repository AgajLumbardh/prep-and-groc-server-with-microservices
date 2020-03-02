const express = require('express');
const path = require('path');
const logger = require('morgan');
const db = require('./src/config/database');
const { NODE_ENV } = require('./src/config/constants');
const apiGatewayRoutes = require('./src/routes');
const errorHandlerMiddleware = require('./src/middlewares/errorHandler');
const invalidJsonErrorHandlerMiddleware = require('./src/middlewares/invalidJsonErrorHandler');

const app = express();
db.connect();

// Add service middlewares
app.use(logger('dev'));

// Define API Gateway routes;
app.use(apiGatewayRoutes);

app.all('*', (req, res) => {
  res.status(404);
  res.send({ error: true, message: 'Page not found.' });
});

// Handle errors;
app.use(invalidJsonErrorHandlerMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
