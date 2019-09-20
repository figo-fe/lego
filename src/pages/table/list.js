import React from 'react';
import { Wrap, Table } from '../../components';

export const TableList = props => {
  const config = {
    base: { name: '所有列表', api: '/table/list', path: 'data' },
    cols: [
      { key: 'id', name: 'ID', width: '100', fn: ['filter', 'order'] },
      { key: 'name', name: '名称', width: '300', fn: ['order'] },
      { key: 'desc', name: '描述', width: '', fn: ['order'] },
    ],
    handles: [
      { key: 'preview', name: '预览', icon: 'eye', url: '/htm/table/use/{{id}}', action: 'open' },
      { key: 'edit', name: '编辑', icon: 'edit', url: '/htm/table/edit/{{id}}', action: 'open' },
      { key: 'delete', name: '删除', icon: 'trash-alt', url: '/table/delete?id={{id}}', action: 'api' },
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
              onClick={() => props.history.push('/htm/table/create')}>
              <i className='fas fa-plus' />
              <span>创建列表</span>
            </button>
          </div>
        </div>
        <Table config={config}></Table>
      </div>
    </Wrap>
  );
};
