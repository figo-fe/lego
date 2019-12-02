const db = require('../db');
const { resEnd } = require('../common');

/**
 * 创建和编辑
 */
const saveChart = data => {
  if (data.id) {
    return db
      .prepare('UPDATE charts SET name = ?, desc = ?, config = ? , ext = ? WHERE id = ?')
      .run(data.name, data.desc, data.config, data.ext, data.id);
  } else {
    return db
      .prepare('INSERT INTO charts (name, desc, config, ext) VALUES (?, ?, ?, ?)')
      .run(data.name, data.desc, data.config, data.ext);
  }
};

const getChart = id => db.prepare('SELECT * FROM charts WHERE id = ?').get(id);

exports.chart = ctx => {
  if (ctx.method.toUpperCase() === 'GET') {
    resEnd(ctx, {
      data: getChart(ctx.query.id),
    });
  } else {
    try {
      const result = saveChart(ctx.request.body);
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
const deleteChart = id => {
  return db.prepare('UPDATE charts SET state = 0 WHERE id = ?').run(id);
};

exports.chartDelete = ctx => {
  resEnd(ctx, {
    data: deleteChart(ctx.query.id),
  });
};

/**
 * 列表
 */
const ps = 20; // pageSize
const getList = (name, pn) => {
  const list = db
    .prepare(
      `SELECT id, name, desc FROM charts WHERE state = 1 AND name LIKE '%${name}%' ORDER BY id DESC LIMIT ${ps} OFFSET ${ps *
        (pn - 1)}`,
    )
    .all();
  return list;
};

const getTotal = () => {
  return db.prepare('SELECT count(id) as total FROM charts WHERE state = 1').get();
};

exports.chartList = ctx => {
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
