/* eslint-disable no-console */
const mongoose = require('mongoose');
const { database, NODE_ENV } = require('./constants');

const { PREFIX_URI, HOST, PORT, COLLECTION, USERNAME, PASSWORD } = database;

const getDBConnectionString = () => {
  let dbConnectionString = PREFIX_URI;
  if (USERNAME && PASSWORD) {
    dbConnectionString += `${USERNAME}:${PASSWORD}@`;
  }
  dbConnectionString += HOST;
  if (NODE_ENV === 'development') {
    dbConnectionString += `:${PORT}`;
  }
  dbConnectionString += `/${COLLECTION}`;
  return dbConnectionString;
};

mongoose.connection.on('connected', () => {
  console.log('Successfuly connected to the database');
});

mongoose.connection.on('error', error => {
  throw error;
});

module.exports = {
  connect() {
    return mongoose.connect(getDBConnectionString(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
  }
};
