const Router = require('koa-router');
const router = new Router();

module.exports = router

router.get('/', function (ctx, next) {
  ctx.response.body = '<p>Hello World!</p>';
});
