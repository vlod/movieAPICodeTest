const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf((i) => `[${i.level.toUpperCase()}][${i.timestamp}]: ${i.message}`),
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

module.exports = logger;
