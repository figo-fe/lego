import React from 'react';
import { Wrap, Table } from '../../components';

export const FormList = props => {
  const host = process.env.NODE_ENV === 'production' ? window.location.host : 'localhost:8081';
  const apiPrefix = `//${host}/lego-api/`;
  const config = {
    base: { name: '表单管理', api: apiPrefix + 'form/list?name={{name}}&pn={{pageNo}}', path: 'data.list' },
    cols: [
      { key: 'id', name: 'ID', width: '80', fn: [] },
      { key: 'name', name: '表单名称', width: '240', fn: ['search'] },
      { key: 'desc', name: '备注', width: '', fn: [] },
    ],
    handles: [
      {
        key: 'view',
        name: '预览',
        icon: 'eye',
        url: '/form/use/{{id}}',
        action: 'link',
      },
      {
        key: 'edit',
        name: '编辑',
        icon: 'edit',
        url: '/form/edit/{{id}}',
        action: 'link',
      },
      { key: 'delete', name: '删除', icon: 'trash-alt', url: apiPrefix + 'form/delete?id={{id}}', action: 'api' },
    ],
  };

  return (
    <Wrap>
      <div className='lego-card'>
        <div id='tableTopHook' className='table-top clearfix'>
          <h2 className='title'>{config.base.name}</h2>
          <div className='btns'>
            <button
              type='button'
              className='btn btn-primary btn-sm'
              onClick={() => props.history.push('/form/create')}>
              <i className='fas fa-plus' />
              <span>创建表单</span>
            </button>
          </div>
        </div>
        <Table config={config}></Table>
      </div>
    </Wrap>
  );
};
