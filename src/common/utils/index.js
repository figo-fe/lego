import _axios from 'axios';
import qs from 'qs';
export { default as json2schema } from './json2schema';
export { default as initEditor } from './initeditor';

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

export const axios = (method = 'GET', api, params = {}) => {
  method = method.toUpperCase() === 'GET' ? 'get' : 'post';
  if (method === 'post') {
    params = qs.stringify(params);
  }
  return new Promise((resolve, reject) => {
    _axios[method](api, params)
      .then(res => {
        const data = res.data;
        if (data.code === 0) {
          resolve(data);
        } else {
          reject(data);
        }
      })
      .catch(res => {
        reject({
          code: -1,
          msg: String(res),
          data: null
        });
      });
  });
};

export const toast = msg => {
  const box = document.createElement('div');
  box.className = 'lego-toast';
  box.innerHTML = msg;
  document.body.appendChild(box);

  setTimeout(() => {
    document.body.removeChild(box);
  }, 3e3);
};
