import React, { useRef, useEffect, useState } from 'react';
import { Wrap, SchemaForm, Button, CommitList } from '../../components';
import { createChart } from '../../config/schema';
import { axios, toast } from '../../common/utils';
import { CHART, PREPATH } from '../../config/apis';

export const ChartEdit = props => {
  const isEdit = props.match.path === '/chart/edit/:id';
  const chartEditor = useRef(null);
  const [commitShow, setCommitShow] = useState(false); // 显示操作记录

  if (isEdit) {
    createChart.title = '编辑图表';
  } else {
    createChart.title = '创建图表';
  }

  function doSubmit() {
    const editor = chartEditor.current;
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

    axios('POST', CHART, postData)
      .then(() => {
        toast('保存成功');
        props.history.push('/chart/list');
      })
      .catch(err => {
        toast(err.msg || err.desc);
      });
  }

  useEffect(() => {
    if (isEdit) {
      const id = props.match.params.id;
      axios('GET', CHART, { id }).then(res => {
        const { config } = res.data;
        if (config) {
          chartEditor.current.setValue(JSON.parse(config));
        }
      });
    }
  }, [isEdit, props.match.params.id]);

  return (
    <Wrap>
      <div className='lego-card'>
        <SchemaForm onReady={editor => (chartEditor.current = editor)} schema={JSON.stringify(createChart)} />
        <div className='btns-row'>
          <Button onClick={doSubmit} value='提交' extClass='btn-primary' />
          <Button value='帮助' onClick={() => window.open(`${PREPATH}/help/chart`)} extClass='btn-outline-primary' />
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
          <CommitList show={commitShow} id={props.match.params.id} type='chart' onClose={() => setCommitShow(false)} />
        )}
      </div>
    </Wrap>
  );
};
