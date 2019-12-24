const db = require('../db');
const { resEnd } = require('../common');

/**
 * 创建和编辑
 */
const saveBoard = data => {
  if (data.id) {
    return db
      .prepare('UPDATE boards SET name = ?, desc = ?, config = ? , ext = ? WHERE id = ?')
      .run(data.name, data.desc, data.config, data.ext, data.id);
  } else {
    return db
      .prepare('INSERT INTO boards (name, desc, config, ext) VALUES (?, ?, ?, ?)')
      .run(data.name, data.desc, data.config, data.ext);
  }
};

const getBoard = id => db.prepare('SELECT * FROM boards WHERE id = ?').get(id);

exports.board = ctx => {
  if (ctx.method.toUpperCase() === 'GET') {
    resEnd(ctx, {
      data: getBoard(ctx.query.id),
    });
  } else {
    try {
      const result = saveBoard(ctx.request.body);
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

/**
 * 删除
 */
const deleteBoard = id => {
  return db.prepare('UPDATE boards SET state = 0 WHERE id = ?').run(id);
};

exports.boardDelete = ctx => {
  resEnd(ctx, {
    data: deleteBoard(ctx.query.id),
  });
};

/**
 * 列表
 */
const ps = 20; // pageSize
const getList = (name, pn) => {
  const list = db
    .prepare(
      `SELECT id, name, desc FROM boards WHERE state = 1 AND name LIKE '%${name}%' ORDER BY id DESC LIMIT ${ps} OFFSET ${ps *
        (pn - 1)}`,
    )
    .all();
  return list;
};

const getTotal = () => {
  return db.prepare('SELECT count(id) as total FROM boards WHERE state = 1').get();
};

exports.boardList = ctx => {
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
