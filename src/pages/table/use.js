import React, { useState, useEffect } from 'react';
import { Wrap, Table } from '../../components';
import { axios } from '../../common/utils';
import { TABLE } from '../../config/apis';

export const TableUse = props => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const id = props.match.params.id;
    axios('GET', TABLE, { id }).then(res => {
      setConfig(JSON.parse(res.data.config));
    });
  }, [props.match.params.id]);

  return (
    <Wrap>
      <div className='lego-card'>
        <div id='tableTopHook' className='table-top clearfix'>
          <h2 className='title'>{config ? config.base.name : ''}</h2>
        </div>
        {config && <Table config={config}></Table>}
      </div>
    </Wrap>
  );
};
