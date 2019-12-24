import React, { useRef, useEffect } from 'react';
import { Wrap, SchemaForm, Button } from '../../components';
import { createBoard } from '../../config/schema';
import { axios, toast } from '../../common/utils';
import { BOARD, PREPATH, BASEURL } from '../../config/apis';

export const BoardEdit = props => {
  const isEdit = props.match.path === '/board/edit/:id';
  const boardEditor = useRef(null);

  if (isEdit) {
    createBoard.title = '编辑面板';
  } else {
    createBoard.title = '创建面板';
  }

  function doSubmit() {
    const editor = boardEditor.current;
    const validates = editor.validate();

    // 校验配置
    if (validates.length > 0) {
      toast(`表单填写有误：<br />${validates.map(err => err.path + ': ' + err.message).join('<br />')}`);
      return;
    }

    // 保存
    const data = editor.getValue();
    const { name, desc } = data;
    const postData = {
      name,
      desc,
      config: JSON.stringify(data),
    };

    // 编辑状态
    if (isEdit) {
      postData.id = props.match.params.id;
    }

    axios('POST', BOARD, postData)
      .then(() => {
        toast('保存成功');
        props.history.push('/board/list');
      })
      .catch(err => {
        toast(err.msg);
      });
  }

  useEffect(() => {
    if (isEdit) {
      const id = props.match.params.id;
      axios('GET', BOARD, { id }).then(res => {
        const { config } = res.data;
        if (config) {
          boardEditor.current.setValue(JSON.parse(config));
        }
      });
    }
    window.JSONEditor.defaults.callbacks.updateModules = (editor, vars, cb) => {
      axios('GET', `${BASEURL}/${vars.type}/list`).then(res => {
        const { list } = res.data;
        if (list.length > 0) {
          editor.value = `/${vars.type}/use/${list[0].id}`;
          cb(
            list.map(({ id, name }) => ({
              value: `/${vars.type}/use/${id}`,
              label: `${name}`,
            })),
          );
        } else {
          editor.value = undefined;
          cb([]);
        }
      });
    };
  }, [isEdit, props.match.params.id]);

  return (
    <Wrap>
      <div className='lego-card'>
        <SchemaForm onReady={editor => (boardEditor.current = editor)} schema={createBoard} />
        <div className='btns-row'>
          <Button onClick={doSubmit} value='提交' extClass='btn-primary' />
          <Button value='帮助' onClick={() => window.open(`${PREPATH}/help/board`)} extClass='btn-outline-primary' />
          <Button onClick={() => props.history.goBack()} value='返回' extClass='btn-outline-secondary' />
        </div>
      </div>
    </Wrap>
  );
};
