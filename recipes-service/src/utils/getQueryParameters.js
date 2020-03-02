const {
  DEFAULT_PAGE_NUMBER,
  ITEMS_PER_PAGE
} = require('../config/constants').paginator;
const findPagesToSkip = require('./findPagesToSkip');

const DEFAULT_SORT = 'Latest';

const sortEnum = {
  Latest: { createdAt: -1 },
  Oldest: { createdAt: 1 },
  AZ: { title: 1 },
  ZA: { title: -1 }
};

module.exports = urlParameters => {
  const queryFilters = {
    skipPages: 0,
    sortType: {},
    query: {}
  };
  if (urlParameters.title) {
    queryFilters.query.title = new RegExp(urlParameters.title, 'i');
  }
  if (urlParameters.country) {
    queryFilters.query.area = urlParameters.country;
  }
  if (urlParameters.category) {
    queryFilters.query.category = urlParameters.category;
  }
  if (urlParameters.ingredient) {
    queryFilters.query['ingredients.name'] = urlParameters.ingredient;
  }
  if (urlParameters.isOwner) {
    queryFilters.query.isOwner = urlParameters.isOwner === 'true';
  }
  if (urlParameters.page) {
    queryFilters.skipPages = findPagesToSkip(urlParameters.page);
  }
  queryFilters.sortType =
    sortEnum[urlParameters.sort] || sortEnum[DEFAULT_SORT];

  queryFilters.currentPage =
    parseInt(urlParameters.page, 10) || DEFAULT_PAGE_NUMBER;
  queryFilters.itemsPerPage = ITEMS_PER_PAGE;
  return queryFilters;
};
