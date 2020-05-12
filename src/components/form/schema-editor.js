import React, { useState, useRef, useLayoutEffect } from 'react';
import { AceCode } from '..';
import { toast } from '../../common/utils';

export default ({ schema, onUpdate }) => {
  const [formSchema, setFormSchema] = useState(Object.assign({ title: '', type: '', format: '', options: {} }, schema));
  const aceRef = useRef(null);
  const choiceRef = useRef(null);

  useLayoutEffect(() => {
    choiceRef.current = new window.Choices('#formTypeSelect', {
      position: 'bottom',
      shouldSort: false,
    });
    return () => {
      choiceRef.current.destroy();
    };
  }, []);

  function onGridChange(evt) {
    const { value } = evt.target;
    const tmp = Object.assign({}, formSchema);
    tmp.options.grid_columns = parseInt(value) || 3;
    setFormSchema(tmp);
  }

  function onTypeChange(evt) {
    const { value } = evt.target;
    const tmp = {
      title: formSchema.title,
      type: 'string',
      format: value,
      options: {
        grid_columns: formSchema.options.grid_columns,
      },
    };

    switch (value) {
      case 'number':
        tmp.type = 'number';
        break;

      case 'boolean':
      case 'switch':
        tmp.type = 'boolean';
        break;

      case 'choices':
        tmp.type = 'string';
        tmp.enum = ['item1', 'item2', 'item3', 'item4'];
        tmp.options.enum_titles = ['选项1', '选项2', '选项3', '选项4'];
        break;

      case 'datetime-local':
      case 'date':
      case 'time':
        tmp.type = 'integer';
        tmp.options.flatpickr = {
          wrap: true,
          showClearButton: true,
          time_24hr: true,
          allowInput: false,
        };
        break;

      case 'upload':
        tmp.type = 'string';
        tmp.links = [
          {
            rel: 'view',
            href: '{{self}}',
            mediaType: 'image',
          },
        ];
        break;

      case 'range':
        tmp.type = 'number';
        tmp.minimum = 1;
        tmp.maximum = 100;
        tmp.step = 2;
        break;

      default:
        tmp.type = 'string';
    }
    setFormSchema(tmp);
  }

  return (
    <div className='row'>
      <div className='col-md-6'>
        <div className='form-group'>
          <label className='form-control-label'>表单类型</label>
          <select
            id='formTypeSelect'
            className='form-control'
            value={formSchema.format || formSchema.type}
            onChange={onTypeChange}>
            <option value='text'>单行文本</option>
            <option value='textarea'>多行文本</option>
            <option value='number'>数值</option>
            <option value='boolean'>布尔值-下拉</option>
            <option value='switch'>布尔值-开关</option>
            <option value='choices'>下拉框</option>
            <option value='datetime-local'>日期时间</option>
            <option value='date'>仅日期</option>
            <option value='time'>仅时间</option>
            <option value='upload'>上传图片</option>
            <option value='password'>密码</option>
            <option value='url'>网址</option>
            <option value='range'>滑动条</option>
            <option value='xhtml'>富文本编辑器</option>
            <option value='json'>代码编辑器-JSON</option>
            <option value='html'>代码编辑器-HTML</option>
            <option value='java'>代码编辑器-JAVA</option>
            <option value='javascript'>代码编辑器-JS</option>
          </select>
        </div>
      </div>
      <div className='col-md-6'>
        <div className='form-group'>
          <label className='form-control-label'>Grid</label>
          <input
            className='form-control'
            type='number'
            min='3'
            max='12'
            onChange={onGridChange}
            value={formSchema.options.grid_columns || 3}
          />
        </div>
      </div>
      <div className='col-md-12'>
        <div className='form-group' style={{ height: 200 }}>
          <AceCode type='json' code={JSON.stringify(formSchema, null, 2)} onReady={ace => (aceRef.current = ace)} />
        </div>
      </div>
      <div className='col-md-12' style={{ textAlign: 'right' }}>
        <button
          className='btn btn-sm btn-outline-primary'
          onClick={() => window.open('https://github.com/json-editor/json-editor#json-editor')}>
          帮助
        </button>
        <button
          className='btn btn-sm btn-success'
          style={{ marginLeft: 10 }}
          onClick={() => {
            try {
              onUpdate(JSON.parse(aceRef.current.getValue()));
            } catch (err) {
              toast(err.toString());
            }
          }}>
          保存
        </button>
      </div>
    </div>
  );
};
