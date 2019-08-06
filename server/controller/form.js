const db = require('../db');
const { resEnd } = require('../common');

const saveForm = data => {
  if (data.id) {
    db.prepare(
      'UPDATE forms set name = ?, api = ?, origin = ?, schema = ? where id = ?'
    ).run(data.name, data.api, data.origin, data.schema, row.id);
  } else {
    db.prepare(
      'INSERT INTO forms (name, api, origin, schema) VALUES (?, ?, ?, ?)'
    ).run(data.name, data.api, data.origin, data.schema);
  }
};

module.exports = ctx => {
  if (ctx.method.toUpperCase() == 'GET') {
  } else {
    try {
      saveForm(ctx.request.body);
      resEnd(ctx);
    } catch (err) {
      resEnd(ctx, { code: 500, msg: String(err) });
    }
  }
};
