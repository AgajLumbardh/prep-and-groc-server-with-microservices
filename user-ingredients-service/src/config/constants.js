module.exports = {
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  database: {
    PREFIX_URI: process.env.DB_URI_PREFIX,
    HOST: process.env.DB_HOST,
    PORT: process.env.DB_PORT,
    COLLECTION: process.env.DB_COLLECTION,
    USERNAME: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD
  },
  paginator: {
    ITEMS_PER_PAGE: 16,
    DEFAULT_PAGE_NUMBER: 1
  }
};
