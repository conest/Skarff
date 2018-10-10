const Koa = require('koa');
const app = new Koa();

// Koa middleware
const compose = require('koa-compose');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');

// third-part middleware
const morgan = require('koa-morgan');
const helmet = require("koa-helmet");

// models
const router = require('./router');
const errorHandler = require('./router/errorHandler');

// settings
const SETTING = require('./model/loadSetting');
const PUBLIC_DIC = './public';

//======================================

app.listen(SETTING.port);

const mwArray = [];

if ( SETTING.logger ) {
  mwArray.push(require('./model/logger')(SETTING));
}

mwArray.push(errorHandler);
mwArray.push(helmet());
mwArray.push(bodyParser());
mwArray.push(router.routes());
mwArray.push(require('koa-static')(PUBLIC_DIC));

app.use(compose(mwArray));
