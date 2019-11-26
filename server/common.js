const fs = require('fs');

exports.API = {
  // 全局设置
  SETTING: '/_lego_api_/setting',

  // 表单
  FORM: '/_lego_api_/form',
  FORM_DELETE: '/_lego_api_/form/delete',
  FORM_LIST: '/_lego_api_/form/list',

  // 列表
  TABLE: '/_lego_api_/table',
  TABLE_DELETE: '/_lego_api_/table/delete',
  Table_LIST: '/_lego_api_/table/list',
};

exports.resEnd = (ctx, ret = {}) => {
  ctx.set('Content-Type', 'application/json');
  ctx.body = JSON.stringify({
    code: ret.code === void 0 ? 0 : ret.code,
    msg: ret.msg || 'success',
    data: ret.data || {},
  });
};

// 日志
const fixTimeNum = num => num > 10 ? num : '0' + num;
exports.printLog = log => {
  console.log(log);
  const date = new Date();
  const time = `${fixTimeNum(date.getHours())}:${fixTimeNum(date.getMinutes())}:${fixTimeNum(date.getSeconds())}`;
  const file = `${date.getFullYear()}${fixTimeNum(date.getMonth() + 1)}.log`;
  if (!fs.existsSync('log')) fs.mkdirSync('log')

  fs.appendFile(`./log/${file}`, `${time} - ${log.toString()}\n`, () => { });
};