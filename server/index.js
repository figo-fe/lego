const Koa = require('koa');
const url = require('url');
const fs = require('fs');
const staticServ = require('koa-static');
const rewrite = require('koa-rewrite');
const bodyParser = require('koa-bodyparser');
const { API } = require('./common');

const ENV = fs.readFileSync(`${process.cwd()}/.env`).toString();
const PREPATH = (ENV.match(/REACT_APP_PRE=([^\n]+)/) || []).pop();

if (!PREPATH) {
  return console.log('Must config .env REACT_APP_PRE!');
}

const {
  setting,
  form,
  formDelete,
  formList,
  table,
  tableDelete,
  tableList,
  chart,
  chartDelete,
  chartList,
  board,
  boardDelete,
  boardList,
} = require('./controller');

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

    case API.TABLE:
      table(ctx);
      break;

    case API.TABLE_DELETE:
      tableDelete(ctx);
      break;

    case API.TABLE_LIST:
      tableList(ctx);
      break;

    case API.CHART:
      chart(ctx);
      break;

    case API.CHART_DELETE:
      chartDelete(ctx);
      break;

    case API.CHART_LIST:
      chartList(ctx);
      break;

    case API.BOARD:
      board(ctx);
      break;

    case API.BOARD_DELETE:
      boardDelete(ctx);
      break;

    case API.BOARD_LIST:
      boardList(ctx);
      break;

    default:
      console.log(ctx);
  }
};
app.use(rewrite(`${PREPATH}/(.*)`, '/index.html'));
app.use(staticServ('build'));
app.use(bodyParser());

app.use(async (ctx, next) => {
  await next();
  // fix favicon
  if (ctx.url === '/favicon.ico') {
    ctx.body = '';
  }

  // controllers
  if (ctx.url.indexOf('/_lego_api_/') === 0) {
    handleApi(ctx);
  }
});

app.listen(8081);
