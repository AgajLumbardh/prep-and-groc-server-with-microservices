const {
  DEFAULT_PAGE_NUMBER,
  ITEMS_PER_PAGE
} = require('../config/constants').paginator;
const findPagesToSkip = require('./findPagesToSkip');

module.exports = urlParameters => {
  const queryFilters = {
    skipPages: 0,
    query: {}
  };
  if (urlParameters.name) {
    queryFilters.query.name = new RegExp(urlParameters.name, 'i');
  }
  if (urlParameters.isCompleted) {
    queryFilters.query.isCompleted = urlParameters.isCompleted === 'true';
  }
  if (urlParameters.page) {
    queryFilters.skipPages = findPagesToSkip(urlParameters.page);
  }

  queryFilters.currentPage =
    parseInt(urlParameters.page, 10) || DEFAULT_PAGE_NUMBER;
  queryFilters.itemsPerPage = ITEMS_PER_PAGE;
  return queryFilters;
};
