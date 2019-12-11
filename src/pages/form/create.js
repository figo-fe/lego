import React, { useState, useRef } from 'react';
import { createForm } from '../../config/schema';
import { axios, toast, json2schema } from '../../common/utils';
import { Wrap, Button, SchemaForm, AceCode } from '../../components';
import { FORM, PREPATH } from '../../config/apis';

import './form.scss';

export const FormCreate = props => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ schema: {}, data: {} });
  const [extShow, setExtShow] = useState(false);
  const configRef = useRef(null);
  const previewRef = useRef(null);
  const extRef = useRef(null);

  // 预览和编辑表单
  function doNext() {
    const configEditor = configRef.current;
    const validates = configEditor.validate();

    if (validates.length > 0) {
      toast(`表单填写有误：<br />${validates.map(err => err.path + ': ' + err.message).join('<br />')}`);
    } else {
      const { name, json } = configEditor.getValue();
      const data = JSON.parse(json);

      // 初始化预览表单
      setForm({ schema: json2schema(data, name), data });

      // 跳至预览页
      setStep(2);
    }
  }

  function doConsole() {
    console.log(previewRef.current.getValue());
  }

  function doSave() {
    const schema = form.schema;
    const { name, api, origin, desc } = configRef.current.getValue();
    const ext = extRef.current.getValue();

    axios('POST', FORM, {
      name,
      api,
      origin,
      desc,
      ext,
      schema: JSON.stringify(schema),
    })
      .then(() => {
        toast('保存成功');
        props.history.push('/form/list');
      })
      .catch(err => {
        toast(err.msg);
      });
  }

  return (
    <Wrap>
      <div className='lego-card'>
        <SchemaForm onReady={editor => (configRef.current = editor)} show={step === 1} schema={createForm} />
        {step === 2 && (
          <>
            <SchemaForm
              schema={form.schema}
              startval={form.data}
              editable={true}
              onReady={editor => (previewRef.current = editor)}
              onSchemaUpdate={schema => setForm(({ data }) => ({ data, schema }))}
            />
            <div className={'form-ext card ' + (extShow ? 'form-ext-show' : '')}>
              <h3>
                <label>表单扩展</label>
                <span className='switch-ext' onClick={() => setExtShow(!extShow)}>
                  <i className='fa fa-angle-right' />
                </span>
              </h3>
              <AceCode type='javascript' onReady={ace => (extRef.current = ace)} />
            </div>
          </>
        )}
        <div className='btns-row'>
          {step === 1 && [
            <Button key='next' value='下一步' onClick={doNext} extClass='btn-primary' />,
            <Button
              key='help'
              onClick={() => window.open(`${PREPATH}/help/form`)}
              value='帮助'
              extClass='btn-outline-primary'
            />,
          ]}
          {step === 2 && [
            <Button key='save' value='保存' onClick={doSave} extClass='btn-success' />,
            <Button key='log' value='console.log' onClick={doConsole} extClass='btn-outline-primary' />,
            <Button
              key='help'
              onClick={() => window.open(`${PREPATH}/help/form`)}
              value='帮助'
              extClass='btn-outline-primary'
            />,
            <Button key='back' value='返回' onClick={() => setStep(1)} extClass='btn-outline-secondary' />,
          ]}
        </div>
      </div>
    </Wrap>
  );
};
