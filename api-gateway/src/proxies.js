const proxy = require('http-proxy-middleware');
const {
  USERS_SERVICE_ROUTE,
  RECIPES_SERVICE_ROUTE,
  USER_INGREDIENTS_SERVICE_ROUTE
} = require('./config/constants').PROXIES;

const setSubjectIdHeaderIfFound = (proxyRequest, request) => {
  if (request.subject) {
    proxyRequest.setHeader('X-SubjectId', request.subject.id);
  }
};

const usersProxy = proxy({
  target: USERS_SERVICE_ROUTE,
  onProxyReq: setSubjectIdHeaderIfFound
});

const recipesProxy = proxy({
  target: RECIPES_SERVICE_ROUTE,
  onProxyReq: setSubjectIdHeaderIfFound
});

const userIngredientsProxy = proxy({
  target: USER_INGREDIENTS_SERVICE_ROUTE,
  onProxyReq: setSubjectIdHeaderIfFound
});

module.exports = {
  usersProxy,
  recipesProxy,
  userIngredientsProxy
};
