const db = require('../db');
const { resEnd } = require('../common');
const { addLog } = require('../controller/log');

const readSetting = () => {
  return db.prepare('select * from setting').get();
};
const saveSetting = data => {
  const row = db.prepare('select * from setting').get();
  let result;

  if (row) {
    result = db
      .prepare(
        'UPDATE setting SET name = ?, baseUrl = ?, permissionApi = ?, sideMenu = ?, uploadFn = ?, config = ? WHERE id = ?',
      )
      .run(data.name, data.baseUrl, data.permissionApi, data.sideMenu, data.uploadFn, data.config, row.id);
  } else {
    result = db
      .prepare(
        'INSERT INTO setting (name, baseUrl, permissionApi, sideMenu, uploadFn, config) VALUES (?, ?, ?, ?, ?, ?)',
      )
      .run(data.name, data.baseUrl, data.permissionApi, data.sideMenu, data.uploadFn, data.config);
  }

  if (result.changes) {
    // 插入日志
    addLog({
      mod_type: 'setting',
      data_id: 1,
      action: 'modify',
      config: JSON.stringify(data),
    });
  }

  return result;
};

exports.saveSetting = saveSetting;

exports.setting = ctx => {
  if (ctx.method.toUpperCase() === 'GET') {
    const data = readSetting() || {};
    resEnd(ctx, { data });
  } else {
    try {
      const data = ctx.request.body;
      const result = saveSetting(data);

      if (result.changes) {
        resEnd(ctx);
      } else {
        resEnd(ctx, { code: 401, msg: '更新数据失败' });
      }
    } catch (err) {
      resEnd(ctx, { code: 500, msg: String(err) });
    }
  }
};
