export const BASEURL = process.env.NODE_ENV === 'production' ? '/_api' : 'http://localhost:8081/_api';
export const SETTING = BASEURL + '/setting';
export const FORM = BASEURL + '/form';
export const TABLE = BASEURL + '/table';
