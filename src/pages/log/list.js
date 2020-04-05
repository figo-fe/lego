import React, { useEffect } from 'react';
import { Wrap, Table } from '../../components';
import { axios, popup } from '../../common/utils';

export const LogList = () => {
  const host = process.env.NODE_ENV === 'production' ? window.location.host : 'localhost:8081';
  const apiPrefix = `//${host}/lego-api/`;
  const config = {
    base: {
      name: '操作日志',
      api: apiPrefix + 'log/list?pn={{pageNo}}&mod_type={{mod_type}}&data_id={{data_id}}',
      path: 'data.list',
    },
    cols: [
      { key: 'id', name: 'ID', width: '80', fn: [] },
      { key: 'mod_type', name: '所属模块', width: '150', fn: [] },
      { key: 'data_id', name: '数据ID', width: '', fn: ['search'] },
      { key: 'action', name: '动作', width: '', fn: [] },
      { key: 'operator', name: '操作者', width: '', fn: [] },
      { key: 'time', name: '时间', width: '', fn: [] },
    ],
    handles: [
      {
        key: 'view',
        name: '查看',
        icon: 'eye',
        url: 'view_log_detail({{id}})',
        action: 'script',
      },
      {
        key: 'edit',
        name: '恢复',
        icon: 'edit',
        url: `${apiPrefix}log/recover?id={{id}}`,
        action: 'api',
      },
    ],
    toolbar: [
      {
        type: 'button',
        name: '清理日志，保留最近1000条记录',
        key: 'clear_log',
        button_opts: {
          style: 'danger',
          action: 'api',
          url: `${apiPrefix}log/clear`,
        },
      },
      {
        type: 'custom',
        name: '筛选日志',
        key: 'filter_label',
        custom_opts: {
          html: '<span style="margin-left:15px">筛选</span>',
        },
      },
      {
        type: 'choices',
        name: '选择模块',
        key: 'search_mod_type',
        choices_opts: {
          source_type: 'list',
          source_data: ':全部;form:表单;table:列表;chart:图表;board:面板;setting:系统设置',
        },
      },
    ],
  };

  useEffect(() => {
    window._colFix_ = (key, value, row) => {
      if (key === 'operator') {
        return value || '--';
      } else if (key === 'mod_type') {
        const modMap = {
          form: '表单',
          table: '列表',
          chart: '图表',
          board: '面板',
          setting: '系统设置',
        };
        return modMap[value];
      }
    };

    window.view_log_detail = id => {
      axios('GET', `${apiPrefix}log`, { id }).then(res => {
        if (res.code === 0) {
          const code = res.data.config ? JSON.parse(res.data.config) : null;

          if (code && code.schema) {
            code.schema = JSON.parse(code.schema);
          }
          if (code && code.config) {
            code.config = JSON.parse(code.config);
          }

          const style = [
            'outline:none;display:block;width:800px;height:500px;font-size:14px',
            'resize:none;border:none;border-radius:5px;background:#111;color:#ddd',
          ].join('');
          const html = [
            '<div style="padding:15px;width:830px;height:530px">',
            `<textarea readonly="true" style="${style}">${JSON.stringify(code, null, 4)}</textarea>`,
            '</div>',
          ].join('');

          popup.show(html, 830, 530);
        }
      });
    };
    return () => {
      delete window.view_log_detail;
      delete window._colFix_;
    };
  }, [apiPrefix]);

  return (
    <Wrap>
      <div className='lego-card'>
        <div id='tableTopHook' className='table-top clearfix'>
          <h2 className='title'>{config.base.name}</h2>
        </div>
        <Table config={config}></Table>
      </div>
    </Wrap>
  );
};
