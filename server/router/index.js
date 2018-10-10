const Router = require('koa-router');
const router = new Router();

router.post('/', function (ctx, next) {
  console.log(ctx.request.body);
  ctx.response.body = 'got it';
});

router.get('/', function (ctx, next) {
  ctx.response.body = 'Hello World!';
});

router.get('/d', function (ctx, next) {
  throw({ message: 'hehehe' });
});

module.exports = router
