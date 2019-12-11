import React, { useRef, useEffect } from 'react';
import { Wrap, SchemaForm, Button, AceCode } from '../../components';
import { createTable } from '../../config/schema';
import { axios, toast } from '../../common/utils';
import { TABLE, PREPATH } from '../../config/apis';

export const TableEdit = props => {
  const isEdit = props.match.path === '/table/edit/:id';
  const formEditor = useRef(null);
  const extEditor = useRef(null);

  if (isEdit) {
    createTable.title = '编辑列表';
  } else {
    createTable.title = '创建列表';
  }

  function doSubmit() {
    const editor = formEditor.current;
    const validates = editor.validate();

    // 校验配置
    if (validates.length > 0) {
      toast(`表单填写有误：<br />${validates.map(err => err.path + ': ' + err.message).join('<br />')}`);
      return;
    }

    const data = editor.getValue();
    const { name, desc } = data.base;
    const postData = {
      name,
      origin,
      desc,
      config: JSON.stringify(data),
      ext: extEditor.current.getValue(),
    };

    // 编辑状态
    if (isEdit) {
      postData.id = props.match.params.id;
    }

    axios('POST', TABLE, postData)
      .then(() => {
        toast('保存成功');
        props.history.push('/table/list');
      })
      .catch(err => {
        toast(err.msg);
      });
  }

  useEffect(() => {
    if (isEdit) {
      const id = props.match.params.id;
      axios('GET', TABLE, { id }).then(res => {
        const { config, ext } = res.data;
        if (config) {
          formEditor.current.setValue(JSON.parse(config));
        }
        if (ext) {
          extEditor.current.setValue(ext);
        }
      });
    }
  }, [isEdit, props.match.params.id]);

  return (
    <Wrap>
      <div className='lego-card'>
        <SchemaForm onReady={editor => (formEditor.current = editor)} schema={createTable} />

        <div className='card card-body' style={{ marginTop: 20, background: '#fafafa' }}>
          <div className='row'>
            <div className='col-md-12'>
              <div className='form-group'>
                <label className='form-control-label'>常规功能无法满足时，利用JavaScript进行扩展</label>
                <div style={{ height: 300 }}>
                  <AceCode type='javascript' onReady={ace => (extEditor.current = ace)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='btns-row'>
          <Button onClick={doSubmit} value='提交' extClass='btn-primary' />
          <Button value='帮助' onClick={() => window.open(`${PREPATH}/help/table`)} extClass='btn-outline-primary' />
          <Button onClick={() => props.history.goBack()} value='返回' extClass='btn-outline-secondary' />
        </div>
      </div>
    </Wrap>
  );
};
