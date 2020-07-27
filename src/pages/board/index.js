import React, { useRef, useEffect, useState } from 'react';
import { Wrap, SchemaForm, Button, CommitList } from '../../components';
import { createBoard } from '../../config/schema';
import { axios, toast } from '../../common/utils';
import { BOARD, BASENAME, BASEURL } from '../../config/apis';

export const BoardEdit = props => {
  const isEdit = props.match.path === '/board/edit/:id';
  const boardEditor = useRef(null);
  const tmpList = useRef({});
  const [commitShow, setCommitShow] = useState(false); // 显示操作记录

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
        toast(err.msg || err.desc);
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

    async function fetchList() {
      await Promise.all([axios('GET', `${BASEURL}/table/list`), axios('GET', `${BASEURL}/chart/list`)]).then(resp => {
        tmpList.current.table = fixList('table', resp[0].data.list);
        tmpList.current.chart = fixList('chart', resp[1].data.list);
      });

      window.getBoardModules = (vars, callback) => {
        const { type } = vars;
        if (type !== 'none' && tmpList.current[type]) {
          callback(tmpList.current[type]);
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
      delete window.getBoardModules;
    };
  }, [isEdit, props.match.params.id]);

  return (
    <Wrap>
      <div className='lego-card'>
        <SchemaForm onReady={editor => (boardEditor.current = editor)} schema={JSON.stringify(createBoard)} />
        <div className='btns-row'>
          <Button onClick={doSubmit} value='提交' extClass='btn-primary' />
          <Button value='帮助' onClick={() => window.open(`${BASENAME}/help/board`)} extClass='btn-outline-primary' />
          <Button onClick={() => props.history.goBack()} value='返回' extClass='btn-outline-secondary' />
        </div>
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
          <CommitList show={commitShow} id={props.match.params.id} type='board' onClose={() => setCommitShow(false)} />
        )}
      </div>
    </Wrap>
  );
};
