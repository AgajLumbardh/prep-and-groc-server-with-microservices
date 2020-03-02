const mongoose = require('mongoose');
const faker = require('faker');

const user = {
  _id: mongoose.Types.ObjectId().toString(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password()
};

const getUser = () => ({
  _id: mongoose.Types.ObjectId().toString(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password()
});

const invalidUser = {
  firstName: '12Km',
  lastName: 'km1233',
  email: 'lkmsdf@km',
  password: '1kmmmmdunsdf'
};

const invalidUserLoginDetails = {
  email: 'agsj@',
  password: 'm 123'
};

module.exports = {
  user,
  getUser,
  invalidUser,
  invalidUserLoginDetails
};
