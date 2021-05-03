
const { createLogger, format, transports } = require('winston');
const { combine, splat, timestamp, printf } = format;

const logFormat = printf( ({ level, message, timestamp , ...metadata}) => {
  let msg = `${timestamp} [${level}] : ${message} `  
  if(metadata) {
    let ms = JSON.stringify(metadata);
    if (ms!=='{}') {
      msg += ms;
    }
  }
  return msg
});

const logger = createLogger({
  level: (process.env.LOG_LEVEL || 'debug'),
  format: combine(
    format.colorize(),
    splat(),
    timestamp(),
    logFormat
  ),
  transports: [
      new (transports.Console)(),
      // new (winston.transports.File)({ filename: 'app.log'})
  ]
})

module.exports = logger;