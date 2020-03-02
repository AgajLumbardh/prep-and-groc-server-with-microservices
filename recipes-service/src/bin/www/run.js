/* eslint-disable no-console */
const http = require('http');
const app = require('../../../app');
const { PORT } = require('../../config/constants');

const server = http.createServer(app);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      return process.exit(1);
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      return process.exit(1);
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}

process.addListener('unhandledRejection', error => {
  throw error;
});

process.addListener('uncaughtException', async error => {
  console.error(`Uncaught exception was thrown: ${error}`);
  process.exit(1);
});

server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);
