const db = require('../db');
const { resEnd } = require('../common');
const { addLog } = require('../controller/log');

/**
 * 创建和编辑
 */
const saveForm = data => {
  if (data.id) {
    return db
      .prepare('UPDATE forms SET name = ?, api = ?, origin = ?, schema = ?, desc = ?, ext = ?, state = 1 WHERE id = ?')
      .run(data.name, data.api, data.origin, data.schema, data.desc, data.ext, data.id);
  } else {
    return db
      .prepare('INSERT INTO forms (name, api, origin, schema, desc, ext) VALUES (?, ?, ?, ?, ?, ?)')
      .run(data.name, data.api, data.origin, data.schema, data.desc, data.ext);
  }
};
exports.saveForm = saveForm;

const getForm = id => db.prepare('SELECT * FROM forms WHERE id = ?').get(id);

exports.form = ctx => {
  if (ctx.method.toUpperCase() === 'GET') {
    resEnd(ctx, {
      data: getForm(ctx.query.id),
    });
  } else {
    try {
      const data = ctx.request.body;
      const result = saveForm(data);
      if (result.changes) {
        // 插入日志
        addLog({
          mod_type: 'form',
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
const deleteForm = id => {
  return db.prepare('UPDATE forms SET state = 0 WHERE id = ?').run(id);
};

exports.formDelete = ctx => {
  const { id } = ctx.query;

  // 插入日志
  addLog({
    mod_type: 'form',
    data_id: id,
    action: 'delete',
    config: '',
  });

  // 接口返回
  resEnd(ctx, { data: deleteForm(id) });
};

/**
 * 列表
 */
const ps = 20; // pageSize
const getList = (name, pn) => {
  const list = db
    .prepare(
      `SELECT id, name, desc FROM forms WHERE state = 1 AND name LIKE '%${name}%' ORDER BY id DESC LIMIT ${ps} OFFSET ${
        ps * (pn - 1)
      }`,
    )
    .all();
  return list;
};

const getTotal = () => {
  return db.prepare('SELECT count(id) as total FROM forms WHERE state = 1').get();
};

exports.formList = ctx => {
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
