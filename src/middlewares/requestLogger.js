const winston = require('winston');
const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});

module.exports = (request, h) => {
  logger.info(`[${request.info.remoteAddress}] ${request.method.toUpperCase()} ${request.path}`);
  return h.continue;
};
