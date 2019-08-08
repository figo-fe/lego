const Koa = require('koa');
const url = require('url');
const static = require('koa-static');
const rewrite = require('koa-rewrite');
const bodyParser = require('koa-bodyparser');
const { setting, form, formDelete, formList } = require('./controller/index');
const { API } = require('./common');

const app = new Koa();

const handleApi = ctx => {
  const pathname = url.parse(ctx.url).pathname;
  switch (pathname) {
    case API.SETTING:
      setting(ctx);
      break;

    case API.FORM:
      form(ctx);
      break;

    case API.FORM_DELETE:
      formDelete(ctx);
      break;

    case API.FORM_LIST:
      formList(ctx);
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
