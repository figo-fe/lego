const Koa = require('koa');
const static = require('koa-static');
const rewrite = require('koa-rewrite');
const bodyParser = require('koa-bodyparser');
const { setting } = require('./controller/index');
const { API } = require('./common');

const app = new Koa();

const handleApi = ctx => {
  switch (ctx.url) {
    case API.SETTING:
      setting(ctx);
      break;
  }
};

app.use(rewrite('/htm/(.*)', '/index.html'));
app.use(static('build'));
app.use(bodyParser());

app.use(async (ctx, next) => {
  await next();
  // fix favicon
  if (ctx.url === '/favicon.ico') {
    ctx.body = '';
  }

  // controllers
  if (ctx.url.indexOf('/_api/') == 0) {
    handleApi(ctx);
  }
});

app.listen(8081);
