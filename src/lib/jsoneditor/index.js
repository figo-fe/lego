import Choices from 'choices.js';
import 'choices.js/public/assets/styles/choices.css';

import { JSONEditor } from './core';
import { UploadFile } from './custom-editors/uploadfile';
import { SwitchBool } from './custom-editors/switchbool';

// Add global
window.Choices = Choices;

// theme
JSONEditor.defaults.theme = 'bootstrap4';
JSONEditor.defaults.options.iconlib = 'fontawesome5';

// ace
JSONEditor.defaults.options.ace = { theme: 'ace/theme/monokai' };

// choices
JSONEditor.defaults.options.choices = {
  shouldSort: false,
  searchEnabled: false,
  itemSelectText: '',
};

// config sceditor
JSONEditor.defaults.options.sceditor = {
  style: process.env.PUBLIC_URL + '/lib/sceditor/content.min.css',
  plugins: 'dragdrop',
  emoticonsEnabled: false,
  icons: 'monocons',
  height: 400,
  toolbar: [
    'bold,italic,underline',
    'font,size,color,removeformat',
    'left,center,right,justify',
    'bulletlist,orderedlist,table,code,quote',
    'image,link,unlink',
    'maximize,source',
  ].join('|'),
  dragdrop: {
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
    handleFile: (file, createPlaceholder) => {
      // https://www.sceditor.com/documentation/plugins/dragdrop/
      const uploader = window.formUploader || window.fileUploader;
      if (uploader) {
        const placeholder = createPlaceholder();
        uploader(file, 'RichTextEditor', {
          success: function (url) {
            placeholder.insert(`<img src="${url}" />`);
          },
          progress: function (percent) {
            console.log(percent);
          },
          fail: function (msg) {
            placeholder.cancel();
            alert(msg);
          },
        });
      }
    },
  },
};

// custom editors
JSONEditor.defaults.resolvers.unshift(function (schema) {
  if (schema.type === 'string' && schema.format === 'upload') {
    return 'uploadFile';
  }
});
JSONEditor.defaults.resolvers.unshift(function (schema) {
  if (schema.type === 'boolean' && schema.format === 'switch') {
    return 'switchBool';
  }
});

JSONEditor.defaults.editors.uploadFile = UploadFile;
JSONEditor.defaults.editors.switchBool = SwitchBool;

export default (element, schema = {}, opts = {}) => {
  if (element) {
    const options = Object.assign(
      {
        disable_edit_json: true,
        disable_properties: true,
        enable_array_copy: true,
        enable_array_sort: true,
        schema,
      },
      opts,
    );
    return (window._editor_ = new JSONEditor(element, options));
  } else {
    return null;
  }
};
