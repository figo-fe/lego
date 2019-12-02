import React, { useRef, useEffect } from 'react';
import { Wrap, SchemaForm, Button } from '../../components';
import { createChart } from '../../config/schema';
import { axios, toast } from '../../common/utils';
import { CHART } from '../../config/apis';

export const ChartEdit = props => {
  const isEdit = props.match.path === '/htm/chart/edit/:id';
  const chartEditor = useRef(null);

  if (isEdit) {
    createChart.title = '编辑图表';
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
        props.history.push('/htm/chart/list');
      })
      .catch(err => {
        toast(err.msg);
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
        <SchemaForm onReady={editor => (chartEditor.current = editor)} schema={createChart} />
        <div className='btns-row'>
          <Button onClick={doSubmit} value='提交' extClass='btn-primary' />
          <Button value='帮助' onClick={() => window.open('/htm/help/chart')} extClass='btn-outline-primary' />
          <Button onClick={() => props.history.goBack()} value='返回' extClass='btn-outline-secondary' />
        </div>
      </div>
    </Wrap>
  );
};
