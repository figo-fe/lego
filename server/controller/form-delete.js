const db = require('../db');
const { resEnd } = require('../common');

const deleteForm = id => {
  return db.prepare('UPDATE forms set state = 0 where id = ?').run(id);
};

module.exports = ctx => {
  resEnd(ctx, {
    data: deleteForm(ctx.query.id)
  });
};
