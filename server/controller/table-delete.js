const db = require('../db');
const { resEnd } = require('../common');

const deleteTable = id => {
  return db.prepare('UPDATE tables set state = 0 where id = ?').run(id);
};

module.exports = ctx => {
  resEnd(ctx, {
    data: deleteTable(ctx.query.id),
  });
};
