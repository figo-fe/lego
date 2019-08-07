import React, { useState, useEffect } from 'react';
import Wrap from '../../components/wrap';
import Table from '../../components/table';
import { FORM_LIST } from '../../common/apis';
import { axios } from '../../common/utils';

export default props => {
  const [list, setList] = useState([]);
  const config = {
    th: [
      {
        key: 'id',
        name: 'ID',
        width: 80
      },
      {
        key: 'name',
        name: '表单名称'
      },
      {
        key: 'url',
        name: 'URL'
      },
      {
        key: 'handles',
        name: '操作',
        width: 200
      }
    ],
    handles: [
      {
        name: '预览',
        action: 'view',
        icon: 'eye'
      },
      {
        name: '编辑',
        action: 'edit',
        icon: 'edit'
      },
      {
        name: '删除',
        action: 'delete',
        icon: 'trash-alt'
      }
    ]
  };
  const mergeList = (config, list) => {
    return list.map(item =>
      Object.assign({}, item, {
        handles: config.handles
      })
    );
  };
  const handle = (action, item) => {
    if (action === 'view') {
      props.history.push(item.url);
    }
  };

  useEffect(() => {
    axios('GET', FORM_LIST).then(res => {
      if (res.data && res.data.length > 0) {
        setList(
          res.data.map(item => ({ ...item, url: `/htm/form/use/${item.id}` }))
        );
      }
    });
  }, []);

  return (
    <Wrap>
      <div className="lego-card">
        <Table th={config.th} list={mergeList(config, list)} handle={handle} />
      </div>
    </Wrap>
  );
};
