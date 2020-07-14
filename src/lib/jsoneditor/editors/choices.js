import { SelectEditor } from './select.js';
import { extend } from '../utilities.js';
import rules from './choices.css';

export class ChoicesEditor extends SelectEditor {
  setValue(value, initial) {
    if (this.choices_instance) {
      /* Sanitize value before setting it */
      let sanitized = this.typecast(value || '');

      // 异步载入enum时默认为空，兼容表单设值
      if (this.enum_values.length === 0) {
        this.enum_values = [sanitized];
        this.enum_options = [String(sanitized)];
        this.enum_display = [String(sanitized)];
      }

      if (!this.enum_values.includes(sanitized)) sanitized = this.enum_values[0];

      if (this.value === sanitized) return;

      if (initial) this.is_dirty = false;
      else if (this.jsoneditor.options.show_errors === 'change') this.is_dirty = true;

      var choicesValue = (this.input.value = this.enum_options[this.enum_values.indexOf(sanitized)]);

      this.choices_instance.setChoiceByValue(choicesValue);

      this.value = sanitized;
      this.onChange(true);
    } else super.setValue(value, initial);
  }

  afterInputReady() {
    if (window.Choices && !this.choices_instance) {
      /* Get options, either global options from "this.defaults.options.choices" or */
      /* single property options from schema "options.choices" */
      this.setter = this.schema.setter;

      const options = this.expandCallbacks(
        'choices',
        extend({}, this.defaults.options.choices || {}, this.options.choices || {}),
      );

      this.choices_instance = new window.Choices(this.input, options);

      // 通过扩展异步设置choices
      if (this.setter && typeof window[this.setter] === 'function') {
        setTimeout(() => {
          try {
            window[this.setter].call(this, {}, list => {
              this.updateChoices(list);
            });
          } catch (e) {
            console.warn(String(e));
          }
        }, 100);
      }
    }
    super.afterInputReady();
  }

  onWatchedFieldChange() {
    super.onWatchedFieldChange();
    if (this.choices_instance) {
      if (this.setter && typeof window[this.setter] === 'function') {
        try {
          window[this.setter].call(this, this.getWatchedFieldValues(), list => {
            this.updateChoices(list);
          });
        } catch (e) {
          console.warn(String(e));
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
    const select_values = [];
    const select_options = [];
    const select_display = [];
    let selected_idx;

    list.forEach((data, idx) => {
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

    if (selected_idx === undefined) {
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
