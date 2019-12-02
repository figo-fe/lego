export const BASEURL = (process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:8081/') + '_lego_api_';
export const SETTING = BASEURL + '/setting';
export const FORM = BASEURL + '/form';
export const TABLE = BASEURL + '/table';
export const CHART = BASEURL + '/chart';
