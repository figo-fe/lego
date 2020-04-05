const db = require('../db');
const { resEnd } = require('../common');
const { addLog } = require('../controller/log');

/**
 * 创建和编辑
 */
const saveTable = data => {
  if (data.id) {
    return db
      .prepare('UPDATE tables SET name = ?, desc = ?, config = ? , ext = ?, state = 1 WHERE id = ?')
      .run(data.name, data.desc, data.config, data.ext, data.id);
  } else {
    return db
      .prepare('INSERT INTO tables (name, desc, config, ext) VALUES (?, ?, ?, ?)')
      .run(data.name, data.desc, data.config, data.ext);
  }
};
exports.saveTable = saveTable;

const getTable = id => db.prepare('SELECT * FROM tables WHERE id = ?').get(id);

exports.table = ctx => {
  if (ctx.method.toUpperCase() === 'GET') {
    resEnd(ctx, {
      data: getTable(ctx.query.id),
    });
  } else {
    try {
      const data = ctx.request.body;
      const result = saveTable(data);
      if (result.changes) {
        // 插入日志
        addLog({
          mod_type: 'table',
          data_id: data.id || result.lastInsertRowid,
          action: data.id ? 'modify' : 'create',
          config: JSON.stringify(data),
        });

        // 接口返回
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
const deleteTable = id => {
  return db.prepare('UPDATE tables SET state = 0 WHERE id = ?').run(id);
};

exports.tableDelete = ctx => {
  const { id } = ctx.query;

  // 插入日志
  addLog({
    mod_type: 'table',
    data_id: id,
    action: 'delete',
    config: '',
  });

  // 接口返回
  resEnd(ctx, { data: deleteTable(id) });
};

/**
 * 列表
 */
const ps = 20; // pageSize
const getList = (name, pn) => {
  const list = db
    .prepare(
      `SELECT id, name, desc FROM tables WHERE state = 1 AND name LIKE '%${name}%' ORDER BY id DESC LIMIT ${ps} OFFSET ${
        ps * (pn - 1)
      }`,
    )
    .all();
  return list;
};

const getTotal = () => {
  return db.prepare('SELECT count(id) as total FROM tables WHERE state = 1').get();
};

exports.tableList = ctx => {
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
