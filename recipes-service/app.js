const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');
const db = require('./src/config/database');
const recipeRoutes = require('./src/recipeRoutes');
const userRecipeRoutes = require('./src/userRecipeRoutes');
const recipeEventSubscribers = require('./src/recipeEventSubscribers');
const errorHandlerMiddleware = require('./src/middlewares/errorHandler');
const invalidJsonErrorHandlerMiddleware = require('./src/middlewares/invalidJsonErrorHandler');

const app = express();

db.connect();
recipeEventSubscribers.load();

// Add middlewares
app.use(cors());
app.use(logger('dev'));
app.use(express.json()); // built-in express MW
app.use(express.urlencoded({ extended: false })); // built-in express MW
app.use(cookieParser()); // third-party express MW

// Define application routes;
app.use('/', recipeRoutes);
app.use('/', userRecipeRoutes);

app.all('*', (req, res) => {
  res.status(404);
  res.send({ error: true, message: 'Page not found.' });
});

// Handle errors;
app.use(invalidJsonErrorHandlerMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
