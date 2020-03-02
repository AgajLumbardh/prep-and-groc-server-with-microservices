const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');
const db = require('./src/config/database');
const groceryItemRoutes = require('./src/groceryItemRoutes');
const fridgeIngredientRoutes = require('./src/fridgeIngredientRoutes');
const subscribers = require('./src/subscribers');
const attachUserMiddleware = require('./src/middlewares/attachUser');
const errorHandlerMiddleware = require('./src/middlewares/errorHandler');
const invalidJsonErrorHandlerMiddleware = require('./src/middlewares/invalidJsonErrorHandler');

const app = express();

db.connect();
subscribers.load();

// Add middlewares
app.use(cors());
app.use(logger('dev'));
app.use(express.json()); // built-in express MW
app.use(express.urlencoded({ extended: false })); // built-in express MW
app.use(cookieParser()); // third-party express MW
app.use(attachUserMiddleware);

// Define application routes;
app.use('/', groceryItemRoutes);
app.use('/', fridgeIngredientRoutes);

app.all('*', (req, res) => {
  res.status(404);
  res.send({ error: true, message: 'Page not found.' });
});

// Handle errors;
app.use(invalidJsonErrorHandlerMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
