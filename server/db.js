const Database = require('better-sqlite3');
const fs = require('fs');

// 检查并创建db目录
if (!fs.existsSync('db')) fs.mkdirSync('db');

const db = new Database('./db/lego.db', { verbose: console.log, readonly: false });

const createSetting = () => {
  const sql = `CREATE TABLE IF NOT EXISTS setting (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL DEFAULT "",
    baseUrl TEXT NOT NULL DEFAULT "",
    sideMenu TEXT NOT NULL DEFAULT "",
    uploadFn TEXT NOT NULL DEFAULT "",
    permissionApi VARCHAR(2000) NOT NULL DEFAULT "",
    config TEXT NOT NULL DEFAULT ""
  )`;

  db.prepare(sql).run();

  // 数据库升级，增加permissionApi字段
  if (db.pragma('table_info(setting)').filter(({ name }) => name === 'permissionApi').length === 0) {
    db.prepare('ALTER TABLE setting ADD permissionApi VARCHAR(2000) NOT NULL DEFAULT ""').run();
  }

  // 数据库升级，增加config字段
  if (db.pragma('table_info(setting)').filter(({ name }) => name === 'config').length === 0) {
    db.prepare('ALTER TABLE setting ADD config TEXT NOT NULL DEFAULT ""').run();
  }
};

const createForm = () => {
  const sql = `CREATE TABLE IF NOT EXISTS forms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    api TEXT,
    origin TEXT,
    desc TEXT,
    schema TEXT,
    ext TEXT DEFAULT '',
    state INTEGER DEFAULT 1
  )`;

  return db.prepare(sql).run();
};

const createTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS tables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    desc TEXT,
    config TEXT,
    ext TEXT DEFAULT '',
    state INTEGER DEFAULT 1
  )`;

  return db.prepare(sql).run();
};

const createChart = () => {
  const sql = `CREATE TABLE IF NOT EXISTS charts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    desc TEXT,
    config TEXT,
    ext TEXT DEFAULT '',
    state INTEGER DEFAULT 1
  )`;

  return db.prepare(sql).run();
};

const createBoard = () => {
  const sql = `CREATE TABLE IF NOT EXISTS boards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    desc TEXT,
    config TEXT,
    ext TEXT DEFAULT '',
    state INTEGER DEFAULT 1
  )`;

  return db.prepare(sql).run();
};

const createLog = () => {
  const sql = `CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mod_type TEXT,
    data_id INTEGER,
    action TEXT,
    operator TEXT DEFAULT '',
    config TEXT,
    ext TEXT DEFAULT '',
    time TIMESTAMP DEFAULT (datetime('now', 'localtime')),
    state INTEGER DEFAULT 1
  )`;

  return db.prepare(sql).run();
};

// 创建表
createSetting();
createForm();
createTable();
createChart();
createBoard();
createLog();

module.exports = db;
