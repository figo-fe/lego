import React, { useRef, useEffect } from 'react';
import { Wrap, SchemaForm, Button } from '../../components';
import { createBoard } from '../../config/schema';
import { axios, toast } from '../../common/utils';
import { BOARD, PREPATH, BASEURL } from '../../config/apis';

export const BoardEdit = props => {
  const isEdit = props.match.path === '/board/edit/:id';
  const boardEditor = useRef(null);
  const tmpList = useRef({});

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

  function fixList(type, list) {
    return list.map(({ id, name }) => ({
      value: `/${type}/use/${id}`,
      label: `${name}`,
    }));
  }

  useEffect(() => {
    const editor = boardEditor.current;
    window._editor_ = editor;

    async function fetchList() {
      await Promise.all([axios('GET', `${BASEURL}/table/list`), axios('GET', `${BASEURL}/chart/list`)]).then(resp => {
        tmpList.current.table = fixList('table', resp[0].data.list);
        tmpList.current.chart = fixList('chart', resp[1].data.list);
      });

      window.JSONEditor.defaults.callbacks.getModules = (_, vars, cb) => {
        const { type } = vars;
        if (type !== 'none' && tmpList.current[type]) {
          cb(tmpList.current[type]);
        }
      };
    }

    fetchList();

    if (isEdit) {
      const id = props.match.params.id;
      axios('GET', BOARD, { id }).then(res => {
        const { config } = res.data;
        config && editor.setValue(JSON.parse(config));
      });
    }

    return () => {
      delete window.JSONEditor.defaults.callbacks.updateModules;
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
