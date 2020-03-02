const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');
const userRoutes = require('./src/userRoutes');
const db = require('./src/config/database');
const errorHandlerMiddleware = require('./src/middlewares/errorHandler');
const invalidJsonErrorHandlerMiddleware = require('./src/middlewares/invalidJsonErrorHandler');

const app = express();

db.connect();

// Add service middlewares
app.use(cors());
app.use(logger('dev'));
app.use(express.json()); // built-in express MW
app.use(express.urlencoded({ extended: false })); // built-in express MW
app.use(cookieParser()); // third-party express MW

// Define service routes;
app.use('/', userRoutes);

app.all('*', (req, res) => {
  res.status(404);
  res.send({ error: true, message: 'Page not found.' });
});

// Handle errors;
app.use(invalidJsonErrorHandlerMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
