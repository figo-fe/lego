const Koa = require('koa');
const url = require('url');
const fs = require('fs');
const staticServ = require('koa-static');
const compress = require('koa-compress');
const rewrite = require('koa-rewrite');
const bodyParser = require('koa-bodyparser');
const { resEnd } = require('./common');

const ENV = fs.readFileSync(`${process.cwd()}/.env`).toString();
const PREPATH = (ENV.match(/REACT_APP_PRE=([^\n]+)/) || []).pop();
const PUBLIC_URL = (ENV.match(/PUBLIC_URL=([^\n]+)/) || []).pop();

if (!PREPATH) {
  return console.log('Must config .env REACT_APP_PRE!');
}

const controllers = require('./controller');

const app = new Koa();

const getControllerName = pathname => {
  const [m, c] = pathname.replace('/lego-api/', '').split('/');
  return m + (c ? c.slice(0, 1).toUpperCase() + c.slice(1) : '');
};

const handleApi = ctx => {
  const pathname = url.parse(ctx.url).pathname;
  const controllerName = getControllerName(pathname);

  if (controllers[controllerName]) {
    controllers[controllerName](ctx);
  } else {
    resEnd(ctx, {
      code: 404,
      msg: 'No controller',
    });
  }
};

app.use(compress());
app.use(rewrite(`${PREPATH}/(.*)`, '/index.html'));
app.use(rewrite(`${PUBLIC_URL}/(.*)`, '/$1'));
app.use(staticServ('build', { maxage: 2592000000 }));
app.use(bodyParser());

app.use(async (ctx, next) => {
  await next();
  // fix favicon
  if (ctx.url === '/favicon.ico') {
    ctx.body = '';
  }

  // controllers
  if (ctx.url.indexOf('/lego-api/') === 0) {
    handleApi(ctx);
  }
});

app.listen(8081);
