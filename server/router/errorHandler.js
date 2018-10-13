async function timeout(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports =  async function(ctx, next) {

  try {
    await next();
    if (ctx.status === 404) {
      var err = new Error('Not Found');
      err.status = 404;
      throw(err);
    }
  } catch (err) {
    if (err.cooling) {
      await timeout(1000);
    }

    ctx.response.status = err.statusCode || err.status || 500;

    if (ctx.setting.env == 'development') {
      console.log(`[DEV ERR] ${err}`);
    }

    if (ctx.request.method === 'POST') {
      let resBody = {
        status: 'ERROR',
        reason: err.reason,
        message: err.message,
      };
      ctx.response.body = resBody;
    } else {
      if (ctx.setting.env == 'development') {
        ctx.response.body = `<h1>${ctx.response.status}</h1><h2>${err.message}</h2><p>[DEV info] ${err}</p>`;
      } else {
        ctx.response.body = `<h1>${ctx.response.status}</h1><h2>${err.message}</h2>`;
      }
    }

  }

};
