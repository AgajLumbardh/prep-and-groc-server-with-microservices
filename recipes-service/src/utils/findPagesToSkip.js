const {
  DEFAULT_PAGE_NUMBER,
  ITEMS_PER_PAGE
} = require('../config/constants').paginator;

module.exports = page => {
  if (parseInt(page, 10) <= 0) return DEFAULT_PAGE_NUMBER;
  return ITEMS_PER_PAGE * (parseInt(page, 10) - 1);
};
