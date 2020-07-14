import { StringEditor } from '../editors/string';

const getUploadBtn = () => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn btn-light';
  btn.innerHTML = [
    '<input type="file" style="position:absolute;opacity:0;left:0;top:0;bottom:0;width:40px" />',
    '<i class="fas fa-cloud-upload-alt"></i>',
  ].join('');

  return btn;
};

const getProgress = () => {
  const progress = document.createElement('div');
  progress.style = [
    'transition: all .5s;position:absolute;left:0;bottom:0px;z-index:9;',
    'height:2px;background:#007bff;border-radius:1px;width:0',
  ].join('');

  return progress;
};

export class UploadFile extends StringEditor {
  build() {
    super.build();

    if (!this.input) return;

    const self = this;
    const parentNode = this.input.parentNode;
    const nextSibling = this.input.nextSibling;

    // 上传按钮
    const uploadButton = getUploadBtn();
    const button = this.theme.getInputGroup(this.input, [uploadButton]);

    // 进度条
    this.progress = getProgress();

    // 插入元素
    parentNode.insertBefore(button, nextSibling);
    button.insertBefore(this.progress, uploadButton.parentNode);

    // 监听选择文件
    uploadButton.firstChild.addEventListener('change', function (e) {
      console.log(e);
      e.preventDefault();
      e.stopPropagation();
      if (this.files && this.files.length) {
        self.uploadFile(this.files[0]);
      }
    });
  }
  uploadFile(file) {
    const uploader = window.formUploader || window.fileUploader;
    if (uploader) {
      const self = this;
      const { path } = self;
      uploader(file, path, {
        progress: function (percent) {
          self.progress.style.opacity = '1';
          self.progress.style.width = `${percent}%`;
        },
        success: function (url) {
          self.progress.style.width = '100%';
          self.progress.style.opacity = '0';
          self.setValue(url);

          setTimeout(() => {
            self.progress.style.width = '0';
          }, 600);
        },
        fail: function (msg) {
          self.progress.style.width = '0';

          if (window._LEGO_UTILS_) {
            window._LEGO_UTILS_.toast(msg);
          } else {
            alert(msg);
          }
        },
      });
    }
  }
  afterInputReady() {}
}
