import { SelectEditor } from './select.js';
import { extend } from '../utilities.js';
import rules from './choices.css';

export class ChoicesEditor extends SelectEditor {
  setValue(value, initial) {
    if (this.choices_instance) {
      /* Sanitize value before setting it */
      let sanitized = this.typecast(value || '');

      // 异步载入enum时将value设为默认项
      if (this.enum_values.length === 0 && value !== undefined) {
        this.enum_values = [sanitized];
        this.enum_display = [String(sanitized)];
        this.enum_options = [String(sanitized)];
        this.theme.setSelectOptions(this.input, this.enum_options, this.enum_display);
      }

      if (!this.enum_values.includes(sanitized)) sanitized = this.enum_values[0];

      if (this.value === sanitized) return;

      if (initial) this.is_dirty = false;
      else if (this.jsoneditor.options.show_errors === 'change') this.is_dirty = true;

      const choicesValue = this.enum_options[this.enum_values.indexOf(sanitized)];

      this.choices_instance.setChoiceByValue(choicesValue);

      this.value = sanitized;
      this.onChange(true);
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
        this.choices_instance.setChoiceByValue(String(this.value)); /* Set new selection */
      }
    }
  }

  updateChoices(list) {
    let selected_idx;

    const values = list.map(({ value, selected }, idx) => {
      if (selected) selected_idx = idx;
      return this.typecast(value);
    });

    const display = list.map(({ label }) => label);
    const options = values.map(value => String(value));

    // 数据不变时不更新
    if (values.join(',') === this.enum_values.join(',')) return;

    this.enum_values = values;
    this.enum_display = display;
    this.enum_options = options;

    // 未指定选中项且值不在选项中，选择第一项
    // if (selected_idx === undefined && !values.includes(this.value)) {
    //   selected_idx = 0;
    // }

    if (selected_idx !== undefined) {
      this.value = values[selected_idx];
      this.onChange(true);
    }

    setTimeout(() => {
      if (this.choices_instance) {
        this.choices_instance.setChoices(
          options.map((value, i) => ({ value, label: display[i] })),
          'value',
          'label',
          true,
        );
        this.choices_instance.setChoiceByValue(String(this.value));
      }
    });
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
