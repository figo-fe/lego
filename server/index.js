const Koa = require('koa');
const url = require('url');
const fs = require('fs');

const staticServ = require('koa-static');
const compress = require('koa-compress');
const rewrite = require('koa-rewrite');
const bodyParser = require('koa-bodyparser');

const controllers = require('./controller');
const { parseEnv, resEnd } = require('./common');

// 获取环境配置
const ENV = fs.readFileSync(`${process.cwd()}/.env`).toString();
const { REACT_APP_PRE: PREPATH, PUBLIC_URL, SERVER_PORT } = parseEnv(ENV);

if (!PREPATH) {
  return console.log('Must config .env REACT_APP_PRE!');
}

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
app.use(bodyParser());

app.use(rewrite('/', '/index.html'));
app.use(rewrite(`${PREPATH}/(.*)`, '/index.html'));
app.use(rewrite(`${PUBLIC_URL}/(.*)`, '/$1'));

app.use(async (ctx, next) => {
  await next();
  // fix favicon
  if (ctx.url === '/favicon.ico') {
    ctx.body = '';
  }

  // index no-cache
  if (ctx.url === '/index.html') {
    ctx.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    ctx.set('Pragma', 'no-cache');
    ctx.set('Expires', 0);
  }
});

// 静态资源
app.use(staticServ('build', { maxage: 2592000000 }));

// 处理接口
app.use(async ctx => {
  // controllers
  if (ctx.url.indexOf('/lego-api/') === 0) {
    handleApi(ctx);
  }
});

app.listen(SERVER_PORT || 8081);
