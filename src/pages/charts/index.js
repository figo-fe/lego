import React, { useState, useRef } from 'react';
import { Wrap, SchemaForm, Button, AceCode } from '../../components';
import { createCharts } from '../../config/schema';
import { axios, toast } from '../../common/utils';

export const ChartsEdit = props => {
  const isEdit = props.match.path === '/htm/charts/edit/:id';
  const chartsEditor = useRef(null);

  if (isEdit) {
    createCharts.title = '编辑图表';
  }

  return (
    <Wrap>
      <div className='lego-card'>
        <SchemaForm onReady={editor => (chartsEditor.current = editor)} schema={createCharts} />
        <div className='btns-row'>
          <Button onClick={() => console.log(chartsEditor.current.getValue())} value='console' extClass='btn-outline-secondary' />
        </div>
      </div>
    </Wrap>
  );
};
