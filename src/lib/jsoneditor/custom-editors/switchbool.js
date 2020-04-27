import { StringEditor } from '../editors/string';

export const SwitchBool = StringEditor.extend({
  build: function () {
    this._super();
    if (!this.input) return;

    const self = this;
    const switchBox = document.createElement('div');

    this.switchInput = this.theme.getFormInputField('checkbox');
    this.switchInput.className = 'custom-control-input';
    this.switchInput.id = 'switch_' + this.formname;

    switchBox.className = 'form-control custom-control custom-switch';
    switchBox.style = 'border:none';
    switchBox.innerHTML = `<label class="custom-control-label" for="switch_${this.formname}"></label>`;
    switchBox.insertBefore(this.switchInput, switchBox.firstChild);

    this.input.parentNode.insertBefore(switchBox, this.input);
    this.input.setAttribute('type', 'hidden');

    this.switchInput.addEventListener('change', function (e) {
      self.setValue(e.target.checked);
    });
  },
  setValue: function (value) {
    this.switchInput.nextSibling.innerHTML = value;
    this.switchInput.checked = value;
    this.value = value;
    this.input.value = value;
    this.onChange(true);
  },
});
