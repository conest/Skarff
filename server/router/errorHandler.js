module.exports =  async function(ctx, next) {

  try {
    await next();
  } catch (err) {
    // TODO: 细化
    ctx.response.status = err.statusCode || err.status || 500;
    ctx.response.body = {
      title: 'ERROR',
      message: err.message,
    };
  }

};
