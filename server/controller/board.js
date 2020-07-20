const db = require('../db');
const { resEnd } = require('../common');
const { addLog } = require('../controller/log');

/**
 * 创建和编辑
 */
const saveBoard = data => {
  let result;

  if (data.id) {
    result = db
      .prepare('UPDATE boards SET name = ?, desc = ?, config = ? , ext = ?, state = 1 WHERE id = ?')
      .run(data.name, data.desc, data.config, data.ext, data.id);
  } else {
    result = db
      .prepare('INSERT INTO boards (name, desc, config, ext) VALUES (?, ?, ?, ?)')
      .run(data.name, data.desc, data.config, data.ext);
  }

  if (result.changes) {
    // 插入日志
    addLog({
      mod_type: 'board',
      data_id: parseInt(data.id || result.lastInsertRowid),
      action: data.id ? 'modify' : 'create',
      config: JSON.stringify(data),
    });
  }

  return result;
};
exports.saveBoard = saveBoard;

const getBoard = id => db.prepare('SELECT * FROM boards WHERE id = ?').get(id);

exports.board = ctx => {
  if (ctx.method.toUpperCase() === 'GET') {
    resEnd(ctx, {
      data: getBoard(ctx.query.id),
    });
  } else {
    try {
      const data = ctx.request.body;
      const result = saveBoard(data);

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
  const { id } = ctx.query;

  // 插入日志
  addLog({
    mod_type: 'board',
    data_id: id,
    action: 'delete',
    config: '',
  });

  // 接口返回
  resEnd(ctx, { data: deleteBoard(id) });
};

/**
 * 列表
 */
const ps = 20; // pageSize
const getList = (name, pn) => {
  const list = db
    .prepare(
      `SELECT id, name, desc FROM boards WHERE state = 1 AND name LIKE '%${name}%' ORDER BY id DESC LIMIT ${ps} OFFSET ${
        ps * (pn - 1)
      }`,
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
