const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('./config/constants');
const UserService = require('./UserService');

module.exports = {
  async authenticatedUser(req, res) {
    res.status(200).send(req.user);
  },

  async login(req, res) {
    const user = await UserService.login(req.body);
    res.cookie('auth', jwt.sign({ id: user._id }, JWT_SECRET_KEY), {
      httpOnly: true
    });
    res.status(200).send(user);
  },

  async signup(req, res) {
    const newUser = await UserService.save(req.body);
    res.cookie('auth', jwt.sign({ id: newUser._id }, JWT_SECRET_KEY), {
      httpOnly: true
    });
    res
      .status(200)
      .send(newUser);
  },

  async logout(req, res) {
    res.clearCookie('auth', { path: '/' });
    res.status(200).send({});
  }
};
