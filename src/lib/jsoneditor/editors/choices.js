// https://github.com/json-editor/json-editor/blob/0393146bc9947b7542a277c89940756e150f1997/src/editors/choices.js
import { SelectEditor } from './select';
import { $extend } from '../utilities';
export var ChoicesEditor = SelectEditor.extend({
  setValue: function (value, initial) {
    if (this.choices_instance && value !== undefined) {
      // Sanitize value before setting it
      var sanitized = this.typecast(value || '');

      // 异步载入enum时默认为空，兼容表单设值
      if (this.enum_values[0] === undefined) {
        this.enum_values = [sanitized];
        this.enum_options = ['' + sanitized];
      }

      if (this.enum_values.indexOf(sanitized) < 0) sanitized = this.enum_values[0];

      if (this.value === sanitized) return;

      if (initial) this.is_dirty = false;
      else if (this.jsoneditor.options.show_errors === 'change') this.is_dirty = true;

      var choicesValue = (this.input.value = this.enum_options[this.enum_values.indexOf(sanitized)]);

      this.choices_instance.setChoiceByValue(choicesValue);

      this.value = sanitized;
      this.onChange();
    } else {
      // 轮询设值
      setTimeout(() => {
        this.setValue(value, initial);
      }, 100);
    }
  },
  afterInputReady: function () {
    if (window.Choices && !this.choices_instance) {
      var self = this;
      var options;
      this.setter = this.schema.setter;

      // Get options, either global options from "this.defaults.options.choices" or
      // single property options from schema "options.choices"
      options = this.expandCallbacks(
        'choices',
        $extend({}, this.defaults.options.choices || {}, this.options.choices || {}),
      );

      this.choices_instance = new window.Choices(this.input, options);

      // 通过扩展异步设置choices
      if (this.setter && typeof window[this.setter] === 'function') {
        setTimeout(function () {
          try {
            window[self.setter].call(self, {}, function (list) {
              self.updateChoices(list);
            });
          } catch (e) {
            console.warn(String(e));
          }
        }, 150);
      }
    }
    this._super();
  },
  onWatchedFieldChange: function () {
    if (this.choices_instance) {
      var self = this;
      if (this.setter && typeof window[this.setter] === 'function') {
        try {
          window[this.setter].call(this, this.getWatchedFieldValues(), function (list) {
            self.updateChoices(list);
          });
        } catch (e) {
          console.warn(String(e));
        }
      } else {
        this._super();
        var choicesList = this.enum_options.map(function (v, i) {
          return { value: v, label: self.enum_display[i] };
        });
        this.choices_instance.setChoices(choicesList, 'value', 'label', true);
        this.choices_instance.setChoiceByValue(this.value + ''); // Set new selection
      }
    }
  },
  updateChoices: function (list) {
    var select_values = [];
    var select_options = [];
    var select_display = [];
    var selected_idx;

    list.forEach(function (data, idx) {
      select_values.push(data.value);
      select_options.push(String(data.value));
      select_display.push(String(data.label));

      if (data.selected === true) {
        selected_idx = idx;
      }
    });

    this.enum_values = select_values;
    this.enum_options = select_options;
    this.enum_display = select_display;

    if (selected_idx === void 0) {
      selected_idx = select_options.indexOf(String(this.value));

      if (selected_idx === -1) {
        selected_idx = 0;
      }
    }

    // 选项中无已选值，默认选择第一个
    this.input.value = select_options[selected_idx];
    this.value = this.typecast(select_options[selected_idx]);
    this.onChange(true);

    setTimeout(() => {
      if (this.choices_instance) {
        this.choices_instance.setChoices(
          list.map(({ label, value }) => ({ label: String(label), value: String(value) })),
          'value',
          'label',
          true,
        );
        this.choices_instance.setChoiceByValue(this.value + '');
      }
    });
  },
  enable: function () {
    if (!this.always_disabled && this.choices_instance) this.choices_instance.enable();
    this._super();
  },
  disable: function (alwaysDisabled) {
    if (this.choices_instance) this.choices_instance.disable();
    this._super(alwaysDisabled);
  },
  destroy: function () {
    if (this.choices_instance) {
      this.choices_instance.destroy();
      this.choices_instance = null;
    }
    this._super();
  },
});
