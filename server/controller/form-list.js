const db = require('../db');
const { resEnd } = require('../common');

const getList = () => {
  const list = db.prepare('SELECT id, name, desc FROM forms WHERE state = 1').all();
  return list;
};

module.exports = ctx => {
  resEnd(ctx, {
    data: getList()
  });
};
