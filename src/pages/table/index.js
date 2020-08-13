import React, { useRef, useEffect, useState } from 'react';
import { Wrap, SchemaForm, Button, AceCode, CommitList } from '../../components';
import { createTable } from '../../config/schema';
import { axios, toast, popup } from '../../common/utils';
import { TABLE, BASENAME } from '../../config/apis';

export const TableEdit = props => {
  const isEdit = props.match.path === '/table/edit/:id';
  const formEditor = useRef(null);
  const extEditor = useRef(null);
  const [commitShow, setCommitShow] = useState(false); // 显示操作记录

  if (isEdit) {
    createTable.title = '编辑列表';
  } else {
    createTable.title = '创建列表';
  }

  function doSave() {
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
        toast(err.msg || err.desc);
      });
  }

  function doPreview() {
    let params = window.location.search;

    params += (params ? '&' : '?') + 'preview=1';

    popup.show(`${BASENAME}/table/use/0${params}`, window.innerWidth - 200, 650);

    const iframeWin = document.querySelector('iframe').contentWindow;

    // 传递预览数据
    iframeWin.addEventListener('load', () => {
      setTimeout(() => {
        const config = JSON.stringify(formEditor.current.getValue());
        const ext = extEditor.current.getValue();

        iframeWin.postMessage({ type: 'LEGO_POPUP_PREVIEW', config, ext });
      }, 500);
    });
  }

  useEffect(() => {
    if (isEdit) {
      const id = props.match.params.id;
      axios('GET', TABLE, { id }).then(res => {
        const { config, ext } = res.data;
        setTimeout(() => {
          if (config) {
            formEditor.current.setValue(Object.assign({ toolbar: [] }, JSON.parse(config)));
          }
          if (ext) {
            extEditor.current.setValue(ext);
          }
        });
      });
    }
  }, [isEdit, props.match.params.id]);

  return (
    <Wrap>
      <div className='lego-card'>
        <SchemaForm onReady={editor => (formEditor.current = editor)} schema={JSON.stringify(createTable)} />

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
          <Button onClick={doSave} value='保存' extClass='btn-success' />
          <Button value='预览' onClick={doPreview} extClass='btn-info' />
          <Button value='帮助' onClick={() => window.open(`${BASENAME}/help/table`)} extClass='btn-outline-primary' />
          <Button onClick={() => props.history.goBack()} value='返回' extClass='btn-outline-secondary' />
        </div>

        {/* commit日志 */}
        {isEdit && (
          <Button
            extStyle={{ position: 'absolute', right: 15, top: 15 }}
            extClass='btn-outline-primary'
            value='Commits'
            icon='code-branch'
            onClick={() => setCommitShow(true)}
          />
        )}
        {isEdit && (
          <CommitList show={commitShow} id={props.match.params.id} type='table' onClose={() => setCommitShow(false)} />
        )}
      </div>
    </Wrap>
  );
};
