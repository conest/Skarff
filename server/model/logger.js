// Morgan logger

const logger = require('koa-morgan');
const MESSAGE = require('../message/messages');

const fs = require('fs');
const path = require('path');

function logStream(SETTING) {

  let logDirectory = path.join(__dirname, '../../' + SETTING.logger.logFolder);
  if (!fs.existsSync(logDirectory)){
    fs.mkdirSync(logDirectory);
  }

  let today = new Date().toISOString().slice(0, 10);
  let logFile = path.join(logDirectory, `${today}.log`);
  return fs.createWriteStream(logFile, { flags: 'a' });
}

module.exports = function(SETTING) {

  const PORT = process.env.PORT || SETTING.port || 3000;
  const ENV = process.env.NODE_ENV || SETTING.env || 'development';
  const PROTOCOL = ( SETTING.https )? 'https' : 'http';

  var startMessage =
    `===== ${MESSAGE.start} =====` + '\n' +
    new Date().toLocaleString() + '\n' +
    `${MESSAGE.env}: ${ENV}` + '\n' +
    `${MESSAGE.protocol}: ${PROTOCOL}` + '\n' +
    `${MESSAGE.portListen}: ${PORT}` + '\n' +
    '===================' + '\n';

    logger.token('date', function() {
        return( new Date().toLocaleString() );
    });

    let mwLogger ;

    if (ENV === 'development') {
      process.stdout.write(startMessage);
      mwLogger = logger('[:date] :remote-addr :remote-user ' +
          ':method :url HTTP/:http-version :status ' +
          ':res[content-length] - :response-time ms');
    } else {
      const wStream = logStream(SETTING);
      wStream.write(startMessage);

      let logSkipCode = 400
      switch (SETTING.logger.logLevel) {
        case 1:
          logSkipCode = 0;
          break;
        case 2:
          logSkipCode = 400;
          break;
        case 3:
          logSkipCode = 500;
          break;
        default:
          break;
      }
      mwLogger = logger(
        '[:date] :remote-addr - :remote-user ' +
        '":method :url HTTP/:http-version" :status ' +
        ':res[content-length] ":referrer" ":user-agent"',
        {
          stream: wStream,
          skip: function (req, res) { return res.statusCode < logSkipCode; }
        }
      )
    }

    return mwLogger;
};
