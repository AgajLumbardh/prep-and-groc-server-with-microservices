const getUser = require('../utils/getUser');

module.exports = (req, res, next) => {
  const subjectId = req.header('x-subjectid');
  getUser(subjectId)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(error => next(error));
};
