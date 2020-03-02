module.exports = routeController => (req, res, next) => {
  Promise.resolve(routeController(req, res, next)).catch(error => next(error));
};
