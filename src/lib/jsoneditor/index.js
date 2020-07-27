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
  position: 'bottom',
};

// WYSIWYG Jodit Editor
const Jodit = window.Jodit;

Jodit.defaultOptions.controls.latex = {
  name: 'Latex',
  icon: 'latex',
  tooltip: 'Insert Latex',
  popup: editor => {
    const form = editor.create.fromHTML(`<div class="jodit_form">
      <div class="jodit_form_group">
        <textarea ref="latex_code" style="width:300px;height:80px;display:block" class="jodit_input"></textarea>
      </div>
      <div class="jodit_buttons">
        <button ref="insert_latex" class="jodit_button" type="button">Insert</button>
      </div>
    </div>`);

    const snapshot = editor.observer.snapshot.make();

    const { latex_code, insert_latex } = Jodit.modules.Helpers.refs(form);

    insert_latex.addEventListener('click', () => {
      editor.observer.snapshot.restore(snapshot);

      const span = editor.create.inside.element('span');
      span.className = 'math-tex';
      span.innerText = latex_code.value;
      editor.selection.insertNode(span);
    });

    return form;
  },
};

JSONEditor.defaults.options.jodit = {
  toolbarSticky: false,
  spellcheck: false,
  showCharsCounter: false,
  showWordsCounter: false,
  sourceEditorNativeOptions: {
    theme: 'ace/theme/monokai',
  },
  sizeLG: 300,
  buttons: [
    'bold',
    'strikethrough',
    'underline',
    'italic',
    'eraser',
    '|',
    'font',
    'fontsize',
    'brush',
    'paragraph',
    '|',
    'superscript',
    'subscript',
    'ul',
    'ol',
    'outdent',
    'indent',
    '|',
    'image',
    'file',
    'video',
    'table',
    'link',
    '|',
    'align',
    'undo',
    'redo',
    'copyformat',
    '|',
    'fullsize',
    'source',
  ],
  events: {
    getIcon: name => {
      if (name === 'latex') {
        return '<i style="font-size:14px" class="fa fa-square-root-alt"></i>';
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
        enable_array_sort: true,
        show_errors: 'change',
        schema,
      },
      opts,
    );
    return (window._editor_ = new JSONEditor(element, options));
  } else {
    return null;
  }
};
