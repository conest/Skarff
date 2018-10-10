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
  const ENV = process.env.NODE_ENV || SETTING.runningEnv || 'development';
  const PROTOCOL = ( SETTING.https )? 'https' : 'http';

  // TODO: production环境输出初始信息
  var startMessage =
    `===== ${MESSAGE.start} =====` + '\n' +
    new Date().toLocaleString() + '\n' +
    `${MESSAGE.runningEnv}: ${ENV}` + '\n' +
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
      mwLogger = logger(
        '[:date] :remote-addr - :remote-user ' +
        '":method :url HTTP/:http-version" :status ' +
        ':res[content-length] ":referrer" ":user-agent"',
        {
          stream: logStream(SETTING),
          skip: function (req, res) { return res.statusCode < 400; }
        }
      )
    }

    return mwLogger;
};
