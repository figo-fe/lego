import { SelectEditor } from './select.js';
import { extend } from '../utilities.js';
import rules from './choices.css';

export class ChoicesEditor extends SelectEditor {
  setValue(value, initial) {
    if (this.choices_instance) {
      /* Sanitize value before setting it */
      let sanitized = this.typecast(value || '');

      if (!this.enum_values.includes(sanitized)) sanitized = this.enum_values[0];

      if (this.value === sanitized) return;

      if (initial) this.is_dirty = false;
      else if (this.jsoneditor.options.show_errors === 'change') this.is_dirty = true;

      this.input.value = this.enum_options[this.enum_values.indexOf(sanitized)];

      this.choices_instance.setChoiceByValue(this.input.value);

      this.value = sanitized;
      this.onChange();
    } else super.setValue(value, initial);
  }

  afterInputReady() {
    if (window.Choices && !this.choices_instance) {
      /* Get options, either global options from "this.defaults.options.choices" or */
      /* single property options from schema "options.choices" */
      const options = this.expandCallbacks(
        'choices',
        extend({}, this.defaults.options.choices || {}, this.options.choices || {}),
      );

      this.choices_instance = new window.Choices(this.input, options);

      // 通过setter异步加载选项
      this.setter = window[this.schema.setter || 'setter_is_undefined'];

      if (typeof this.setter === 'function') {
        try {
          this.setter.call(this, {}, list => this.updateChoices(list));
        } catch (err) {
          console.warn(err);
        }
      }
    }
    super.afterInputReady();
  }

  onWatchedFieldChange() {
    super.onWatchedFieldChange();
    if (this.choices_instance) {
      if (typeof this.setter === 'function') {
        try {
          this.setter.call(this, this.getWatchedFieldValues(), list => this.updateChoices(list));
        } catch (err) {
          console.warn(err);
        }
      } else {
        const choicesList = this.enum_options.map((v, i) => ({
          value: v,
          label: this.enum_display[i],
        }));
        this.choices_instance.setChoices(choicesList, 'value', 'label', true);
        this.choices_instance.setChoiceByValue(`${this.value}`); /* Set new selection */
      }
    }
  }

  updateChoices(list) {
    const values = list.map(({ value }) => value);
    const display = list.map(({ label }) => label);
    const options = values.map(value => String(value));

    this.enum_values = values;
    this.enum_display = display;
    this.enum_options = options;

    if (values.includes(this.value)) {
      setTimeout(() => {
        if (this.choices_instance) {
          this.choices_instance.setChoices(list, 'value', 'label', true);
        }
      });
    } else {
      // 会触发onWatchedFieldChange
      this.value = values[0];
      this.onChange(true);
    }
  }

  enable() {
    if (!this.always_disabled && this.choices_instance) this.choices_instance.enable();
    super.enable();
  }

  disable(alwaysDisabled) {
    if (this.choices_instance) this.choices_instance.disable();
    super.disable(alwaysDisabled);
  }

  destroy() {
    if (this.choices_instance) {
      this.choices_instance.destroy();
      this.choices_instance = null;
    }
    super.destroy();
  }
}

ChoicesEditor.rules = rules;
