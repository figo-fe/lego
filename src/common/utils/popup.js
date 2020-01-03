const renderIframe = (url, width, height) => `
<div class="popup-main" style="width:${width}px;height:${height}px">
  <div class="popup-hide" onClick="_LEGO_UTILS_.popup.hide()" title="关闭"><i class="fas fa-times"></i></div>
  <iframe src="${url}" frameborder="0" style="width:100%;height:100%;border:none"></iframe>
</div>
`;
const renderHtml = (html, width, height) => `
<div class="popup-main" style="width:${width}px;height:${height}px">
<div class="popup-hide" onClick="_LEGO_UTILS_.popup.hide()" title="关闭"><i class="fas fa-times"></i></div>
  <div class="popup-box">${html}</div>
</div>
`;
const container = document.createElement('div');
container.className = 'popup-mask';

const show = (src, width = 750, height = 500) => {
  if (!src) return alert('缺少必要参数');
  const isIframe = /^(http|\/)/.test(src);
  container.innerHTML = isIframe ? renderIframe(src, width, height) : renderHtml(src, width, height);
  document.body.appendChild(container);
};

const hide = () => {
  document.body.removeChild(container);
};

export default { show, hide };
