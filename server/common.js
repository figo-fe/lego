const fs = require('fs');

exports.parseEnv = env => {
  const list = env.split('\n');
  const envMap = {};

  list.forEach(element => {
    if (element.indexOf('=') > 0) {
      const [k, v] = element.split('=');
      envMap[k] = v;
    }
  });

  return envMap;
};

exports.resEnd = (ctx, ret = {}) => {
  ctx.set('Content-Type', 'application/json');
  ctx.body = JSON.stringify({
    code: ret.code === void 0 ? 0 : ret.code,
    msg: ret.msg || 'success',
    data: ret.data || {},
  });
};

const dateFormat = (exports.dateFormat = (ms, fmt) => {
  /**
   * 时间格式化，将13位时间戳格式化为时间字符串
   * @param {number/string} [ms] 需要转换的毫秒值
   * @param {string} [fmt] 输出格式，不传默认为 {yyyy-MM-dd hh:mm:ss}
   * @return {string} 返回转换后的时间字符串
   */
  var date = new Date(parseInt(ms));
  fmt = fmt || 'yyyy-MM-dd hh:mm:ss';

  var o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
  return fmt;
});

// 日志
exports.printLog = log => {
  const ts = Date.now();
  const time = dateFormat(ts);
  const file = `${dateFormat(ts, 'yyyy-MM')}.log`;

  console.log(log);

  if (!fs.existsSync('log')) fs.mkdirSync('log');

  fs.appendFile(`./log/${file}`, `${time} - ${log.toString()}\n`, () => {});
};
