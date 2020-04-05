export const BASEURL = (process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:8081/') + 'lego-api';
export const SETTING = BASEURL + '/setting';
export const FORM = BASEURL + '/form';
export const TABLE = BASEURL + '/table';
export const CHART = BASEURL + '/chart';
export const BOARD = BASEURL + '/board';
export const PREPATH = process.env.REACT_APP_PRE;
