const { setting } = require('./setting');
const { form, formDelete, formList } = require('./form');
const { table, tableDelete, tableList } = require('./table');
const { chart, chartDelete, chartList } = require('./chart');
const { board, boardDelete, boardList } = require('./board');
const { log, logDelete, logList, logRecover, logClear } = require('./log');

module.exports = {
  setting,
  form,
  formDelete,
  formList,
  table,
  tableDelete,
  tableList,
  chart,
  chartDelete,
  chartList,
  board,
  boardDelete,
  boardList,
  log,
  logDelete,
  logList,
  logRecover,
  logClear,
};
