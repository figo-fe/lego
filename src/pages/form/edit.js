import React, { useState, useEffect, useRef } from 'react';
import { Wrap, SchemaForm, AceCode, Button } from '../../components';
import { axios, toast } from '../../common/utils';
import { FORM, PREPATH } from '../../config/apis';

export const FormEdit = props => {
  const [formData, setFormData] = useState({
    name: '',
    api: '',
    origin: '',
    schema: '{}',
    desc: '',
    ext: '',
    loading: true,
  });
  const formRef = useRef(null);
  const extRef = useRef(null);

  useEffect(() => {
    const id = props.match.params.id;
    axios('GET', FORM, { id }).then(res => {
      const { name, api, origin, desc, schema, ext } = res.data;
      setFormData({ name, api, origin, desc, schema, ext, loading: false });
    });
  }, [props.match.params.id]);

  function doConsole() {
    console.log(formRef.current.getValue());
  }

  function doSave() {
    axios('POST', FORM, {
      id: props.match.params.id,
      ...formData,
      ext: extRef.current.getValue(),
    })
      .then(() => {
        toast('保存成功');
        props.history.push('/form/list');
      })
      .catch(err => {
        toast(err.msg);
      });
  }

  function doBack() {
    props.history.goBack();
  }

  function handleChange(evt) {
    const target = evt.target;
    const value = target.value;
    const key = target.name;
    setFormData(Object.assign({}, formData, { [key]: value }));
  }

  return (
    <Wrap loading={formData.loading}>
      <div className='lego-card'>
        <SchemaForm
          schema={JSON.parse(formData.schema)}
          onReady={editor => (formRef.current = editor)}
          onSchemaUpdate={schema => setFormData(data => Object.assign({}, data, { schema: JSON.stringify(schema) }))}
          editable={true}
        />
        <div className='card card-body' style={{ marginTop: 20, background: '#fafafa' }}>
          <div className='row'>
            <div className='col-md-3'>
              <div className='form-group'>
                <label className='form-control-label'>表单名称</label>
                <input type='text' value={formData.name} onChange={handleChange} name='name' className='form-control' />
              </div>
            </div>
            <div className='col-md-3'>
              <div className='form-group'>
                <label className='form-control-label'>提交API</label>
                <input type='text' onChange={handleChange} value={formData.api} name='api' className='form-control' />
              </div>
            </div>
            <div className='col-md-3'>
              <div className='form-group'>
                <label className='form-control-label'>数据API</label>
                <input
                  type='text'
                  onChange={handleChange}
                  value={formData.origin}
                  name='origin'
                  className='form-control'
                />
              </div>
            </div>
            <div className='col-md-3'>
              <div className='form-group'>
                <label className='form-control-label'>表单备注</label>
                <input type='text' onChange={handleChange} value={formData.desc} name='desc' className='form-control' />
              </div>
            </div>
            <div className='col-md-12'>
              <div className='form-group'>
                <label className='form-control-label'>表单扩展</label>
                <div style={{ height: 350 }}>
                  <AceCode code={formData.ext} type='javascript' onReady={ace => (extRef.current = ace)} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='btns-row'>
          <Button value='保存' onClick={doSave} extClass='btn-success' />
          <Button value='console.log' onClick={doConsole} extClass='btn-outline-primary' />
          <Button
            key='help'
            onClick={() => window.open(`${PREPATH}/help/form`)}
            value='帮助'
            extClass='btn-outline-primary'
          />
          <Button value='返回' onClick={doBack} extClass='btn-outline-secondary' />
        </div>
      </div>
    </Wrap>
  );
};
