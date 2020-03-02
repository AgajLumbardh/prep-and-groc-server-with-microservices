const events = require('events');

const eventEmitter = new events.EventEmitter();

module.exports = {
  publish(event, message) {
    eventEmitter.emit(event, message);
  },

  subscribe(event, subscriber) {
    eventEmitter.on(event, subscriber);
  }
};
