import React, { useState, useCallback } from 'react';
import Wrap from '../../components/wrap';
import { axios, toast, initEditor } from '../../common/utils';
import { FORM } from '../../config/apis';

export default props => {
  const [formData, setFormData] = useState({
    name: '',
    api: '',
    origin: '',
    schema: '',
    desc: ''
  });
  const [schemaShow, setSchemaShow] = useState(true);

  const formRef = useCallback(
    node => {
      const id = props.match.params.id;
      if (node) {
        axios('GET', FORM, { id }).then(res => {
          const { name, api, origin, schema } = res.data;
          setFormData({ name, api, origin, schema });
          formRef.current = initEditor(node, JSON.parse(schema));
        });
      } else {
        setFormData({});
        formRef.current.destroy();
      }
    },
    [props.match.params.id]
  );

  const schemaRef = useCallback(
    node => {
      const ace = window.ace;
      if (node && formData.schema) {
        schemaRef.current = ace.edit(node, { mode: 'ace/mode/json' });
        schemaRef.current.setTheme('ace/theme/monokai');
      }
    },
    [formData.schema]
  );

  function toggleSchema() {
    const next = !schemaShow;
    setSchemaShow(next);
    if (next) {
      schemaRef.current.resize();
    }
  }

  function doConsole() {
    console.log(formRef.current.getValue());
  }

  function doUpdate() {
    const node = formRef.current.element;
    const schema = schemaRef.current.getValue();
    formRef.current.destroy();
    formRef.current = initEditor(node, JSON.parse(schema));
  }

  function doSave() {
    const schema = schemaRef.current.getValue();
    axios('POST', FORM, {
      id: props.match.params.id,
      ...formData,
      schema: JSON.stringify(JSON.parse(schema))
    })
      .then(() => {
        toast('保存成功');
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
    <Wrap>
      <div className="lego-card">
        <div className="form-view">
          <div ref={formRef} />
          <div className={'schema-box' + (schemaShow ? ' schema-show' : '')}>
            <div ref={schemaRef} className="schema-code">
              {JSON.stringify(JSON.parse(formData.schema || '{}'), null, 4)}
            </div>
            <div
              className="switch-btn"
              title="编辑schema"
              onClick={toggleSchema}
            >
              <i
                className={'fa fa-angle-' + (schemaShow ? 'right' : 'left')}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
        <div
          className="card card-body"
          style={{ marginTop: 20, background: '#fafafa' }}
        >
          <div className="row">
            <div className="col-md-3">
              <div className="form-group">
                <label className="form-control-label">表单名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  name="name"
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="form-control-label">提交接口</label>
                <input
                  type="text"
                  onChange={handleChange}
                  value={formData.api}
                  name="api"
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="form-control-label">数据接口</label>
                <input
                  type="text"
                  onChange={handleChange}
                  value={formData.origin}
                  name="origin"
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="form-control-label">备注</label>
                <input
                  type="text"
                  onChange={handleChange}
                  value={formData.desc}
                  name="desc"
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="btns-row">
          <button
            onClick={doSave}
            type="button"
            className="btn btn-success btn-sm"
          >
            保存
          </button>
          <button
            onClick={doConsole}
            type="button"
            className="btn btn-outline-primary btn-sm"
          >
            console.log
          </button>
          <button
            onClick={doUpdate}
            type="button"
            className="btn btn-outline-primary btn-sm"
          >
            更新表单
          </button>
          <button
            onClick={doBack}
            type="button"
            className="btn btn-outline-secondary btn-sm"
          >
            返回
          </button>
        </div>
      </div>
    </Wrap>
  );
};
