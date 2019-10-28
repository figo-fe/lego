import React, { useState, useEffect } from 'react';
import { Wrap, Table } from '../../components';
import { axios, execJs } from '../../common/utils';
import { TABLE } from '../../config/apis';

export const TableUse = props => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const id = props.match.params.id;
    let fn, script;
    axios('GET', TABLE, { id }).then(res => {
      setConfig(JSON.parse(res.data.config));
      [fn, script] = execJs(res.data.ext);
    });

    return () => {
      try {
        // 跳出时卸载JS
        console.log(`unmount ${fn}`);
        delete window[fn];
        script.remove();
      } catch (e) {
        console.warn(e);
      }
    };
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
