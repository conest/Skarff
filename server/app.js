const Koa = require('koa');
const app = new Koa();

// Koa middleware
const compose = require('koa-compose');
const bodyParser = require('koa-bodyparser');

// third-part middleware
const morgan = require('koa-morgan');
const helmet = require("koa-helmet");

// models
const router = require('./router');
const errorHandler = require('./router/errorHandler');

// settings
const SETTING = require('./model/loadSetting');
const PUBLIC_DIC = './public';

SETTING.rootPath = __dirname;
app.context.setting = SETTING;

// Protocol setting & listening. HTTP / HTTPS
require('./model/protocol')(app, SETTING);

//======================================
// loading middlewares
//======================================

const mwArray = [];

if ( SETTING.logger.enabled ) {
  mwArray.push(require('./model/logger')(SETTING));
}

mwArray.push(errorHandler);
mwArray.push(helmet());

if ( SETTING.compress.enabled ) {
  const compress = require('koa-compress');
  mwArray.push(compress());
}

if ( SETTING.session.enabled ){
  const session = require('koa-session');
  const CONFIG = {
    secret: SETTING.session.secret,
    renew: true,
    maxAge: SETTING.session.age,
  };
  mwArray.push(session(CONFIG, app));
}

mwArray.push(bodyParser());
mwArray.push(router.routes());
mwArray.push(require('koa-static')(PUBLIC_DIC));

app.use(compose(mwArray));
