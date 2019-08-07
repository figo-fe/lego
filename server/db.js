const Database = require('better-sqlite3');

const db = new Database('./db/lego.db', { verbose: console.log });

const createSettingTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS setting (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    baseUrl TEXT NOT NULL,
    sideMenu TEXT NOT NULL,
    uploadFn TEXT NOT NULL
  )`;

  return db.prepare(sql).run();
};

const createFormTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS forms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    api TEXT,
    origin TEXT,
    schema TEXT,
    state INTEGER DEFAULT 1
  )`;

  return db.prepare(sql).run();
};

// 创建表单
console.log(createSettingTable());
console.log(createFormTable());

module.exports = db;
