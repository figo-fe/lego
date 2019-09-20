exports.API = {
  // 全局设置
  SETTING: '/_api/setting',

  // 表单
  FORM: '/_api/form',
  FORM_DELETE: '/_api/form/delete',
  FORM_LIST: '/_api/form/list',

  // 列表
  TABLE: '/_api/table',
  TABLE_DELETE: '/_api/table/delete',
  Table_LIST: '/_api/table/list',
};

exports.resEnd = (ctx, ret = {}) => {
  ctx.set('Content-Type', 'application/json');
  ctx.body = JSON.stringify({
    code: ret.code === void 0 ? 0 : ret.code,
    msg: ret.msg || 'success',
    data: ret.data || {},
  });
};
