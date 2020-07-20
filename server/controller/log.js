const db = require('../db');
const { resEnd } = require('../common');

/**
 * 插入日志
 */
const addLog = data => {
  return db
    .prepare('INSERT INTO logs (mod_type, data_id, action, operator, config) VALUES (?, ?, ?, ?, ?)')
    .run(data.mod_type, data.data_id, data.action, data.operator, data.config);
};
exports.addLog = addLog;

const getLog = id => db.prepare('SELECT mod_type, data_id, config FROM logs WHERE id = ?').get(id);

exports.log = ctx => {
  if (ctx.method.toUpperCase() === 'GET') {
    resEnd(ctx, {
      data: getLog(ctx.query.id),
    });
  } else {
    try {
      const result = addLog(ctx.request.body);
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
const deleteLog = id => {
  return db.prepare('UPDATE logs SET state = 0 WHERE id = ?').run(id);
};

exports.logDelete = ctx => {
  resEnd(ctx, {
    data: deleteLog(ctx.query.id),
  });
};

/**
 * 列表
 */

const getList = (mod_type, data_id, pn, ps = 20) => {
  let find = 'state = 1';
  find += mod_type ? ` AND mod_type = '${mod_type}'` : '';
  find += data_id ? ` AND data_id = '${data_id}'` : '';

  const list = db
    .prepare(
      `SELECT id, mod_type, data_id, action, operator, time FROM logs WHERE ${find} ORDER BY id DESC LIMIT ${ps} OFFSET ${
        ps * (pn - 1)
      }`,
    )
    .all();
  return list;
};

const getTotal = (mod_type, data_id) => {
  let find = 'state = 1';
  find += mod_type ? ` AND mod_type = '${mod_type}'` : '';
  find += data_id ? ` AND data_id = '${data_id}'` : '';
  return db.prepare(`SELECT count(id) as total FROM logs WHERE ${find}`).get();
};

exports.logList = ctx => {
  const { mod_type, data_id, pn = 1, ps = 20 } = ctx.query;
  resEnd(ctx, {
    data: {
      list: getList(mod_type, data_id, pn, ps),
      page: {
        pageSize: ps,
        pageNo: pn,
        ...getTotal(mod_type, data_id),
      },
    },
  });
};

exports.logRecover = ctx => {
  const { id } = ctx.query;
  const { mod_type, data_id, config } = getLog(id) || {};
  let result = {};

  if (mod_type && data_id && config) {
    const data = JSON.parse(config);
    data.id = data_id;
    switch (mod_type) {
      case 'setting':
        result = require('./setting').saveSetting(data);
        break;

      case 'form':
        result = require('./form').saveForm(data);
        break;

      case 'table':
        result = require('./table').saveTable(data);
        break;

      case 'chart':
        result = require('./chart').saveChart(data);
        break;

      case 'board':
        result = require('./board').saveBoard(data);
        break;

      default:
        console.log('recover error');
    }
  }

  if (result.changes) {
    resEnd(ctx);
  } else {
    resEnd(ctx, { code: 400, msg: '无法恢复数据' });
  }
};

// 清理日志
exports.logClear = ctx => {
  const { total } = db.prepare('SELECT count(id) as total FROM logs WHERE state = 1').get();
  if (total > 1000) {
    db.prepare(`delete from logs where id in (select id from logs limit ${total - 1000})`).run();
  }
  resEnd(ctx);
};
