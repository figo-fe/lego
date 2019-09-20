const db = require('../db');
const { resEnd } = require('../common');

const saveForm = data => {
  if (data.id) {
    return db
      .prepare('UPDATE forms set name = ?, api = ?, origin = ?, schema = ?, desc = ?, ext = ? where id = ?')
      .run(data.name, data.api, data.origin, data.schema, data.desc, data.ext, data.id);
  } else {
    return db
      .prepare('INSERT INTO forms (name, api, origin, schema, desc, ext) VALUES (?, ?, ?, ?, ?, ?)')
      .run(data.name, data.api, data.origin, data.schema, data.desc, data.ext);
  }
};

const getForm = id => db.prepare('SELECT * FROM forms WHERE id = ?').get(id);

module.exports = ctx => {
  if (ctx.method.toUpperCase() === 'GET') {
    resEnd(ctx, {
      data: getForm(ctx.query.id),
    });
  } else {
    try {
      const result = saveForm(ctx.request.body);
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
