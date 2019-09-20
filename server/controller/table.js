const db = require('../db');
const { resEnd } = require('../common');

const saveTable = data => {
  if (data.id) {
    return db
      .prepare('UPDATE tables set name = ?, desc = ?, config = ? , ext = ? where id = ?')
      .run(data.name, data.desc, data.config, data.ext, data.id);
  } else {
    return db
      .prepare('INSERT INTO tables (name, desc, config, ext) VALUES (?, ?, ?, ?)')
      .run(data.name, data.desc, data.config, data.ext);
  }
};

const getTable = id => db.prepare('SELECT * FROM tables WHERE id = ?').get(id);

module.exports = ctx => {
  if (ctx.method.toUpperCase() === 'GET') {
    resEnd(ctx, {
      data: getTable(ctx.query.id),
    });
  } else {
    try {
      const result = saveTable(ctx.request.body);
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
