const JSONEditor = window.JSONEditor;

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

JSONEditor.defaults.resolvers.unshift(function(schema) {
  if (schema.type === 'string' && schema.format === 'upload') {
    return 'uploadFile';
  }
});

JSONEditor.defaults.editors.uploadFile = JSONEditor.AbstractEditor.extend({
  build: function() {
    const self = this;
    const btn = getUploadBtn();
    this.title = this.header = this.label = this.theme.getFormInputLabel(this.getTitle());

    this.input = this.theme.getFormInputField('text');
    this.inputGroup = this.theme.getInputGroup(this.input, [btn]);

    // 进度条
    this.progress = getProgress();
    this.inputGroup.insertBefore(this.progress, btn.parentNode);

    this.control = this.theme.getFormControl(this.label, this.inputGroup, this.description, this.infoButton);
    this.container.appendChild(this.control);
    this.input.value = this.value;

    this.input.addEventListener('change', function(e) {
      e.preventDefault();
      e.stopPropagation();

      self.is_dirty = true;
      self.refreshValue();
      self.onChange(true);
    });

    btn.firstChild.addEventListener('change', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (this.files && this.files.length) {
        self.uploadFile(this.files[0]);
      }
    });

    // style fix
    btn.parentNode.className = 'input-group-append';
    this.input.parentNode.style.marginBottom = '10px';
  },
  uploadFile: function(file) {
    const uploader = window.formUploader || window.fileUploader;
    if (uploader) {
      const self = this;
      const { path } = self;
      uploader(file, path, {
        progress: function(percent) {
          self.progress.style.opacity = '1';
          self.progress.style.width = `${percent}%`;
        },
        success: function(url) {
          self.progress.style.width = '100%';
          self.progress.style.opacity = '0';
          setTimeout(() => {
            self.progress.style.width = '0';
          }, 600);
          self.setValue(url);
        },
        fail: function(msg) {
          self.progress.style.width = '0';
          alert(msg);
        },
      });
    }
  },
  setValue: function(val) {
    if (this.value !== val) {
      this.value = val;
      this.input.value = this.value;
      this.onChange();
    }
  },
  refreshValue: function() {
    this.value = this.input.value;
    if (typeof this.value !== 'string') this.value = '';
    this.serialized = this.value;
  },
  sanitize: function(value) {
    return value;
  },
});

export default (el, schema = {}, opts = {}) => {
  if (JSONEditor && el) {
    JSONEditor.defaults.theme = 'bootstrap4';
    JSONEditor.defaults.options.iconlib = 'fontawesome5';
    JSONEditor.plugins.ace.theme = 'monokai';

    // config sceditor
    JSONEditor.plugins.sceditor.style = process.env.PUBLIC_URL + '/lib/sceditor/content.min.css';
    JSONEditor.plugins.sceditor.plugins = 'dragdrop';
    JSONEditor.plugins.sceditor.emoticonsEnabled = false;
    JSONEditor.plugins.sceditor.icons = 'monocons';
    JSONEditor.plugins.sceditor.height = 400;

    // config choices
    JSONEditor.plugins.choices = {
      shouldSort: false,
    };

    // 富文本编辑器默认工具栏
    JSONEditor.plugins.sceditor.toolbar = [
      'bold,italic,underline',
      'font,size,color,removeformat',
      'left,center,right,justify',
      'bulletlist,orderedlist,table,code,quote',
      'image,link,unlink',
      'maximize,source',
    ].join('|');

    // 富文本编辑器拖动上传
    JSONEditor.plugins.sceditor.dragdrop = {
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
      handleFile: (file, createPlaceholder) => {
        // https://www.sceditor.com/documentation/plugins/dragdrop/
        const uploader = window.formUploader || window.fileUploader;
        if (uploader) {
          const placeholder = createPlaceholder();
          uploader(file, 'wysiwyg', {
            success: function(url) {
              placeholder.insert(`<img src="${url}" />`);
            },
            progress: function(percent) {
              console.log(percent);
            },
            fail: function(msg) {
              placeholder.cancel();
              alert(msg);
            },
          });
        }
      },
    };

    return (window._JsonEditor_ = new JSONEditor(el, {
      disable_edit_json: true,
      disable_properties: true,
      ...opts,
      schema,
    }));
  } else {
    return null;
  }
};
