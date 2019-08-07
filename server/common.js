exports.API = {
  SETTING: '/_api/setting',
  FORM: '/_api/form',
  FORM_LIST: '/_api/form/list'
};

exports.resEnd = (ctx, ret = {}) => {
  ctx.set('Content-Type', 'application/json');
  ctx.body = JSON.stringify({
    code: ret.code === void 0 ? 0 : ret.code,
    msg: ret.msg || 'success',
    data: ret.data || {}
  });
};
