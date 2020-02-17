import _axios from 'axios';
import qs from 'qs';
import MD5 from 'md5.js';
import popup from './popup';
export { default as json2schema } from './json2schema';
export { default as initEditor } from './initeditor';
export { popup };

export const loadJs = url => {
  return new Promise(resolve => {
    const script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script);

    if (document.addEventListener) {
      script.addEventListener('load', resolve);
    } else {
      script.onreadystatechange = () => {
        if (/loaded|complete/.test(script.readyState)) {
          script.onreadystatechange = null;
          resolve();
        }
      };
    }
  });
};

export const kv = key => {
  let params = window.location.search;
  if (params.length) {
    return (params.match(new RegExp('[?&]' + key + '=([^&]+)')) || ['']).pop();
  } else {
    return '';
  }
};

export const parseUrl = url => {
  const map = {};
  if (!url) {
    url = window.location.search;
  }
  if (url.length < 2) {
    return {};
  }
  url
    .replace(/^\?/, '')
    .split('&')
    .forEach(kv => {
      const arr = kv.split('=');
      map[arr[0]] = arr[1];
    });

  return map;
};

export const axios = (method = 'GET', api, params = {}) => {
  method = method.toUpperCase() === 'GET' ? 'get' : 'post';
  if (method === 'post') {
    params = qs.stringify(params);
  } else {
    params = {
      params: params,
    };
  }
  return new Promise((resolve, reject) => {
    _axios[method](api, params)
      .then(res => {
        const data = res.data;
        if (data.code === 0) {
          resolve(data);
        } else {
          if (String(data.code) === process.env.REACT_APP_LOGIN_CODE) {
            if (process.env.REACT_APP_LOGIN_URL) {
              window.location.assign(process.env.REACT_APP_LOGIN_URL);
            } else {
              window.location.assign(process.env.REACT_APP_PRE + '/login');
            }
          }
          reject(data);
        }
      })
      .catch(res => {
        reject({
          code: -1,
          msg: String(res),
          data: null,
        });
      });
  });
};

export const toast = (msg, duration = 3000) => {
  const box = document.createElement('div');
  box.className = 'lego-toast';
  box.innerHTML = msg;
  document.body.appendChild(box);

  setTimeout(() => {
    document.body.removeChild(box);
  }, duration);
};

export const execJs = jsCode => {
  const s = document.createElement('script');
  const fn = 'ext_' + Date.now().toString(16);

  s.innerHTML = `window.${fn} = (function () {
    try {
      ${jsCode}
    } catch (err) { console.warn('ExtJs Error -', err) }
  })()`;

  document.body.appendChild(s);

  return [fn, s];
};

// 构建带有模板变量的URL
export const buildUrl = (url, params) => {
  let data = parseUrl() || {};
  if (params) {
    data = Object.assign(data, params);
  }
  return url.replace(/\{\{[^}]+\}\}/g, find => {
    const key = find.slice(2, -2);
    return `${data[key] || ''}`;
  });
};

// 构建API，按需自动拼接baseUrl
export const buildApi = (baseUrl, api) => (/^(http|\/\/)/.test(api) ? '' : baseUrl) + api;

/**
 * 根据path查找object中的值
 * @param {object} object
 * @param {string} path 如 data.list..name，「..」用map取得相应数据并返回
 */
export const findByPath = (object, path) => {
  // 容错
  if (!object || path.length === 0) return undefined;

  // 查找相应属性
  path = path.indexOf('.') === 0 ? path : `.${path}`;
  let obj = Object.assign({}, object);
  let splits = path.match(/\.{1,2}[^.]+/g);

  for (let i = 0; i < splits.length; i++) {
    let v = splits[i];
    let k = v.replace(/\./g, '');

    if (v.indexOf('..') === 0) {
      if (Array.isArray(obj)) {
        obj = obj.map(o => o[k]);
      } else {
        return undefined;
      }
    } else {
      if (obj && obj.hasOwnProperty(k)) {
        obj = obj[k];
      } else {
        return undefined;
      }
    }
  }
  return obj;
};

// 根据path查找schema对应节点
export const findSchemaByPath = (schema, path) => {
  if (path === 'root') return schema;

  let tmp = Object.assign({}, schema);
  let props = path.split('.').slice(1);

  for (let i = 0, len = props.length; i < len; i++) {
    if (tmp.type === 'object') {
      tmp = tmp['properties'][props[i]];
    } else if (tmp.type === 'array') {
      tmp = tmp['items'];
    }
  }

  return tmp;
};

// 根据path更新schema对应节点
export const updateSchemaByPath = (schema, path, data) => {
  if (path === 'root') return data;
  let props = path.split('.').slice(1);

  for (var i = 0, len = props.length - 1; i < len; i++) {
    if (schema.type === 'object') {
      schema = schema['properties'][props[i]];
    } else if (schema.type === 'array') {
      schema = schema['items'];
    }
  }

  schema['properties'][props[i]] = data;
};

export const dateFormat = (ms, fmt) => {
  /**
   * 时间格式化，将13位时间戳格式化为时间字符串
   * @param {number/string} [ms] 需要转换的毫秒值
   * @param {string} [fmt] 输出格式，不传默认为 {yyyy-MM-dd hh:mm:ss}
   * @return {string} 返回转换后的时间字符串
   */
  var date = new Date(parseInt(ms));
  fmt = fmt || 'yyyy-MM-dd hh:mm:ss';

  var o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
  return fmt;
};

export const copy = text => {
  const $ = window.$;
  const $el = $(`<textarea style='width:0;height:0'>${text}</textarea>`);
  $('body').append($el);
  $el[0].select();
  document.execCommand('Copy');
  $el.remove();
  toast(`复制成功「${text}」`);
};

export const md5 = text => new MD5().update(text).digest('hex');

export const isInFrame = window.self !== window.top;

window._LEGO_UTILS_ = {
  popup,
  parseUrl,
  toast,
  copy,
  md5,
  dateFormat,
};
