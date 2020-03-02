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
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  PROXIES: {
    USERS_SERVICE_ROUTE: `http://${process.env.USERS_SERVICE_HOST}:${process.env.USERS_SERVICE_PORT}`,
    RECIPES_SERVICE_ROUTE: `http://${process.env.RECIPES_SERVICE_HOST}:${process.env.RECIPES_SERVICE_PORT}`,
    USER_INGREDIENTS_SERVICE_ROUTE: `http://${process.env.USER_INGREDIENTS_SERVICE_HOST}:${process.env.USER_INGREDIENTS_SERVICE_PORT}`
  }
};
