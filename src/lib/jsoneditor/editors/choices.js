import { SelectEditor } from './select';
import { $extend } from '../utilities';
export var ChoicesEditor = SelectEditor.extend({
  setValue: function (value, initial) {
    if (this.choices_instance) {
      // Sanitize value before setting it
      var sanitized = this.typecast(value || '');

      if (this.enum_values[0] === undefined) return;

      if (this.enum_values.indexOf(sanitized) < 0) sanitized = this.enum_values[0];

      if (this.value === sanitized) return;

      if (initial) this.is_dirty = false;
      else if (this.jsoneditor.options.show_errors === 'change') this.is_dirty = true;

      this.input.value = this.enum_options[this.enum_values.indexOf(sanitized)];

      this.choices_instance.setChoiceByValue(sanitized);

      this.value = sanitized;
      this.onChange();
    } else this._super(value, initial);
  },
  afterInputReady: function () {
    if (window.Choices && !this.choices_instance) {
      var options;
      // Get options, either global options from "this.defaults.options.choices" or
      // single property options from schema "options.choices"
      options = this.expandCallbacks(
        'choices',
        $extend({}, this.defaults.options.choices || {}, this.options.choices || {}),
      );

      this.choices_instance = new window.Choices(this.input, options);
    }
    this._super();
  },
  onWatchedFieldChange: function () {
    this._super();

    var vars = this.getWatchedFieldValues();

    // 自定义source，支持异步
    if (this.enumSource && this.enumSource[0].setter) {
      var enumSetter = this.enumSource[0].setter;
      if (typeof window[enumSetter] === 'function') {
        window[enumSetter](this, vars);
      }
      return;
    }

    // 被监听字段更新
    if (this.choices_instance && vars.self === void 0) {
      var self = this;
      var choicesList = this.enum_options.map(function (v, i) {
        return { value: v, label: self.enum_display[i] };
      });
      this.choices_instance.setChoices(choicesList, 'value', 'label', true);
      this.choices_instance.setChoiceByValue(this.value + ''); // Set new selection
    }
  },
  updateChoices: function (list) {
    var select_values = [];
    var select_options = [];
    var select_display = [];

    list.forEach(function (data) {
      select_values.push(data.value);
      select_options.push(String(data.value));
      select_display.push(String(data.label));
    });

    this.enum_values = select_values;
    this.enum_options = select_options;
    this.enum_display = select_display;

    // 选项中无已选值，默认选择第一个
    if (select_options.indexOf(this.value) === -1) {
      this.input.value = select_options[0];
      this.value = this.typecast(select_options[0]);
      this.onChange(true);
    }

    setTimeout(() => {
      if (this.choices_instance) {
        this.choices_instance.setChoices(list, 'value', 'label', true);
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