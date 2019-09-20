const db = require('../db');
const { resEnd } = require('../common');

const getList = () => {
  const list = db.prepare('SELECT id, name, desc FROM tables WHERE state = 1 order by id desc').all();
  return list;
};

module.exports = ctx => {
  resEnd(ctx, {
    data: getList(),
  });
};
