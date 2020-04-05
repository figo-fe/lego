const db = require('../db');
const { resEnd } = require('../common');
const { addLog } = require('../controller/log');

const readSetting = () => {
  return db.prepare('select * from setting').get();
};
const saveSetting = data => {
  const row = db.prepare('select * from setting').get();

  if (row) {
    return db
      .prepare('UPDATE setting SET name = ?, baseUrl = ?, permissionApi = ?, sideMenu = ?, uploadFn = ? WHERE id = ?')
      .run(data.name, data.baseUrl, data.permissionApi, data.sideMenu, data.uploadFn, row.id);
  } else {
    return db
      .prepare('INSERT INTO setting (name, baseUrl, permissionApi, sideMenu, uploadFn) VALUES (?, ?, ?, ?, ?, ?)')
      .run(data.name, data.baseUrl, data.permissionApi, data.sideMenu, data.uploadFn);
  }
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
        // 插入日志
        addLog({
          mod_type: 'setting',
          data_id: 1,
          action: 'modify',
          config: JSON.stringify(data),
        });

        // 接口返回
        resEnd(ctx);
      } else {
        resEnd(ctx, { code: 401, msg: '更新数据失败' });
      }
    } catch (err) {
      resEnd(ctx, { code: 500, msg: String(err) });
    }
  }
};
