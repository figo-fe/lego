import React, { useState, useRef, useEffect } from 'react';
import { Wrap, Button, SchemaForm, CodePopup } from '../../components';
import { createForm, formJsonDemo } from '../../config/schema';
import { json2schema, toast, axios } from '../../common/utils';
import { FORM, PREPATH } from '../../config/apis';

import './form.scss';

export const FormEdit = props => {
  const isEdit = props.match.path === '/form/edit/:id';
  const configRef = useRef(null);
  const [loading, setLoading] = useState(isEdit); //页面加载状态
  const [jsonPopShow, setJsonPopShow] = useState(false); // 显示数据模型输入框

  // 表单数据
  const [formData, setFormData] = useState({
    name: '',
    api: '',
    origin: '',
    desc: '',
    schema: '',
    ext: '',
  });

  useEffect(() => {
    if (isEdit) {
      const id = props.match.params.id;
      axios('GET', FORM, { id }).then(res => {
        const { name, api, origin, desc, schema, ext } = res.data;
        setFormData({ name, api, origin, desc, schema, ext });
        setLoading(false);

        setTimeout(() => {
          configRef.current.setValue({ name, api, origin, desc, ext });
        });
      });
    }
  }, [isEdit, props.match.params.id]);

  // 保存表单
  function doSave() {
    const postData = Object.assign(formData, configRef.current.getValue());

    if (isEdit) {
      postData.id = props.match.params.id;
    }

    axios('POST', FORM, postData)
      .then(() => {
        toast('保存成功');
        props.history.goBack();
      })
      .catch(err => {
        toast(err.msg || err.desc);
      });
  }

  return (
    <Wrap loading={loading}>
      <div className='lego-card'>
        {formData.schema.length > 0 ? (
          <SchemaForm
            editable={true}
            schema={JSON.parse(formData.schema)}
            onSchemaUpdate={schema => setFormData(data => Object.assign({}, data, { schema: JSON.stringify(schema) }))}
          />
        ) : (
          <div
            className='form-preview-box'
            onClick={() => {
              const nameEditor = configRef.current.getEditor('root.name');
              if (nameEditor.getValue()) {
                setJsonPopShow(true);
              } else {
                toast('请先填写表单名称');
                nameEditor.input.focus();
              }
            }}>
            <h3>表单预览区</h3>
            <p>点此区域导入数据模型，自动生成表单</p>
          </div>
        )}

        {/* 表单配置 */}
        <div style={{ marginTop: 20 }}>
          <SchemaForm schema={createForm} onReady={editor => (configRef.current = editor)} />
        </div>

        {/* 底部按钮 */}
        <div className='btns-row'>
          <Button value='保存' onClick={doSave} extClass='btn-success' />
          <Button
            key='help'
            onClick={() => window.open(`${PREPATH}/help/form`)}
            value='帮助'
            extClass='btn-outline-primary'
          />
          <Button value='返回' onClick={() => props.history.goBack()} extClass='btn-outline-secondary' />
        </div>

        {/* 弹窗-编辑schema */}
        {jsonPopShow && (
          <CodePopup
            demo={JSON.stringify(formJsonDemo, null, 2)}
            onSubmit={code => {
              try {
                const schema = json2schema(JSON.parse(code), configRef.current.getValue().name);
                setFormData(Object.assign(formData, { schema: JSON.stringify(schema) }));
                setJsonPopShow(false);
              } catch (err) {
                toast(String(err));
              }
            }}
            onClose={() => setJsonPopShow(false)}
          />
        )}
      </div>
    </Wrap>
  );
};
