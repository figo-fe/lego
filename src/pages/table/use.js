import React, { useState, useEffect, useRef } from 'react';
import { Wrap, Table } from '../../components';
import { axios, execJs, kv, isInFrame } from '../../common/utils';
import { TABLE } from '../../config/apis';

export const TableUse = props => {
  const [config, setConfig] = useState(null);
  const preview = useRef(kv('preview'));

  useEffect(() => {
    let fn, script;
    if (isInFrame && preview.current === '1') {
      window.addEventListener('message', evt => {
        const { type, config, ext } = evt.data;
        if (type === 'LEGO_POPUP_PREVIEW') {
          setConfig(JSON.parse(config));
          [fn, script] = execJs(ext);
        }
      });
    } else {
      const id = props.match.params.id;
      axios('GET', TABLE, { id }).then(res => {
        setConfig(JSON.parse(res.data.config));
        [fn, script] = execJs(res.data.ext);
      });
    }

    return () => {
      try {
        // 重置
        setConfig(null);

        // 跳出时卸载JS
        console.log(`unmount ${fn}`);
        delete window[fn];
        delete window._colFix_;
        delete window._pageFix_;
        delete window._lego_table_data_;
        script.remove();
      } catch (e) {
        console.warn(e);
      }
    };
  }, [props.match.params.id]);

  if (!(config && config.base && config.cols)) return null;

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
