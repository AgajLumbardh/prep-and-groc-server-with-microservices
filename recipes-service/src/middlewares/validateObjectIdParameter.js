const mongoose = require('mongoose');
const ValueError = require('../errors/ValueError');

module.exports = (req, res, next) => {
  try {
    mongoose.Types.ObjectId(req.params.id);
    next();
  } catch (error) {
    next(new ValueError('Invalid item id'));
  }
};
