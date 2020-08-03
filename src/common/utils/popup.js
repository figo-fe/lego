const renderIframe = (url, width, height) => {
  height = height === 'auto' ? 'auto' : height + 'px';
  return `<div class="popup-main" style="width:${width}px;height:${height}">
  <div class="popup-hide" onClick="_LEGO_UTILS_.popup.hide()" title="关闭"><i class="fas fa-times"></i></div>
    <iframe src="${url}" frameborder="0" style="width:100%;height:100%;border:none"></iframe>
  </div>`;
};

const renderHtml = (html, width, height) => {
  height = height === 'auto' ? 'auto' : height + 'px';
  return `<div class="popup-main" style="width:${width}px;height:${height}">
  <div class="popup-hide" onClick="_LEGO_UTILS_.popup.hide()" title="关闭"><i class="fas fa-times"></i></div>
    <div class="popup-box">${html}</div>
  </div>`;
};
const container = document.createElement('div');
container.className = 'popup-mask';

const cbs = {};

const updateHeight = evt => {
  try {
    const { type, height } = evt.data;
    if (type === 'LEGO_POPUP_HEIGHT') {
      window.$('.popup-main').height(Math.min(650, height));
    }
  } catch (e) {}
};

const show = (src, width = 800, height = 'auto') => {
  if (!src) return alert('缺少必要参数');
  const isIframe = /^(http|\/)/.test(src);
  container.innerHTML = isIframe ? renderIframe(src, width, height) : renderHtml(src, width, height);
  document.body.appendChild(container);

  if (height === 'auto') {
    // 自适应高度
    window.addEventListener('message', updateHeight);
  }

  return {
    then: onHide => (cbs.onHide = onHide),
  };
};

const hide = execOnHide => {
  // execOnHide 是否执行关闭回调，点x不执行
  document.body.removeChild(container);
  window.removeEventListener('message', updateHeight);
  if (execOnHide && typeof cbs.onHide === 'function') {
    cbs.onHide();
    delete cbs.onHide;
  }
};

export default { show, hide };
