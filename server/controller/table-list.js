const db = require('../db');
const { resEnd } = require('../common');
const ps = 20; // pageSize

const getList = (name, pn) => {
  const list = db
    .prepare(
      `SELECT id, name, desc FROM tables WHERE state = 1 AND name LIKE '%${name}%' ORDER BY id DESC LIMIT ${ps} OFFSET ${ps *
        (pn - 1)}`,
    )
    .all();
  return list;
};

const getTotal = () => {
  return db.prepare('SELECT count(id) as total FROM tables WHERE state = 1').get();
};

module.exports = ctx => {
  const { name = '', pn = 1 } = ctx.query;
  resEnd(ctx, {
    data: {
      list: getList(name, pn),
      page: {
        pageSize: ps,
        pageNo: pn,
        ...getTotal(),
      },
    },
  });
};
