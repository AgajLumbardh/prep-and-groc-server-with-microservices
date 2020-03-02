const { ITEMS_PER_PAGE } = require('../config/constants').paginator;

module.exports = totalItems => Math.ceil(totalItems / ITEMS_PER_PAGE);
