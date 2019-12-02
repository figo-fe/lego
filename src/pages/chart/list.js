import React from 'react';
import { Wrap, Table } from '../../components';

export const ChartList = props => {
  const host = process.env.NODE_ENV === 'production' ? window.location.host : 'localhost:8081';
  const apiPrefix = `//${host}/_lego_api_/`;
  const config = {
    base: { name: '图表管理', api: apiPrefix + 'chart/list?name={{name}}&pn={{pageNo}}', path: 'data.list' },
    cols: [
      { key: 'id', name: 'ID', width: '100', fn: [] },
      { key: 'name', name: '图表名称', width: '300', fn: ['search'] },
      { key: 'desc', name: '备注', width: '', fn: [] },
    ],
    handles: [
      {
        key: 'preview',
        name: '预览',
        icon: 'eye',
        url: `//${window.location.host}/htm/chart/use/{{id}}`,
        action: 'open',
      },
      {
        key: 'edit',
        name: '编辑',
        icon: 'edit',
        url: `//${window.location.host}/htm/chart/edit/{{id}}`,
        action: 'open',
      },
      { key: 'delete', name: '删除', icon: 'trash-alt', url: apiPrefix + 'chart/delete?id={{id}}', action: 'api' },
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
              onClick={() => props.history.push('/htm/chart/create')}>
              <i className='fas fa-plus' />
              <span>创建图表</span>
            </button>
          </div>
        </div>
        <Table config={config}></Table>
      </div>
    </Wrap>
  );
};
