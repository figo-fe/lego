const db = require('../db');
const { resEnd } = require('../common');

const readSetting = () => {
  return db.prepare('select * from setting').get();
};
const saveSetting = data => {
  const row = db.prepare('select * from setting').get();

  if (row) {
    db.prepare('UPDATE setting SET name = ?, baseUrl = ?, mode = ?, sideMenu = ?, uploadFn = ? WHERE id = ?').run(
      data.name,
      data.baseUrl,
      data.mode,
      data.sideMenu,
      data.uploadFn,
      row.id,
    );
  } else {
    db.prepare('INSERT INTO setting (name, baseUrl, mode, sideMenu, uploadFn) VALUES (?, ?, ?, ?, ?)').run(
      data.name,
      data.baseUrl,
      data.mode,
      data.sideMenu,
      data.uploadFn,
    );
  }
};

module.exports = ctx => {
  if (ctx.method.toUpperCase() === 'GET') {
    const data = readSetting() || {};
    resEnd(ctx, { data });
  } else {
    try {
      saveSetting(ctx.request.body);
      resEnd(ctx);
    } catch (err) {
      resEnd(ctx, { code: 500, msg: String(err) });
    }
  }
};
