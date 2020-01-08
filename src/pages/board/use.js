import React, { useEffect, useState, Fragment, useRef, useContext } from 'react';
import { SettingContext } from '../../config/context';
import { Wrap } from '../../components';
import { axios } from '../../common/utils';
import { BOARD } from '../../config/apis';
import './board.scss';

export const BoardUse = props => {
  const context = useContext(SettingContext);
  const [config, setConfig] = useState({ list: [] });
  const [tabIdx, setTabIdx] = useState(0);
  const initMap = useRef({ '0': true });

  useEffect(() => {
    const id = props.match.params.id;
    axios('GET', BOARD, { id }).then(res => {
      setConfig(JSON.parse(res.data.config));
    });
  }, [props.match.params.id]);

  return (
    <Wrap>
      <Fragment>
        {config.mode === 'tab' && (
          <div className='board-tabs'>
            {config.list.map((block, i) => (
              <div
                key={block.name}
                onClick={() => {
                  initMap.current[i] = true;
                  setTabIdx(i);
                }}
                className={'board-tab-item' + (i === tabIdx ? ' board-tab-cur' : '')}>
                {block.name}
              </div>
            ))}
          </div>
        )}
      </Fragment>
      {config.list && (
        <div className={'board-content board-mode-' + config.mode}>
          {config.list.map((block, i) => {
            if (config.mode === 'tab' && !initMap.current[i]) {
              return <div key={block.name}></div>;
            }
            return (
              <div
                className={'lego-card' + (context.mode === 'standalone' ? ' lego-card-inner' : '')}
                key={block.name}
                style={{
                  padding: '10px 0',
                  marginBottom: config.mode === 'tiled' && 15,
                  height: config.mode === 'tiled' && block.height + 20,
                  display: i === tabIdx || config.mode === 'tiled' ? 'block' : 'none',
                }}>
                {block.mods.map((mod, j) => (
                  <iframe
                    key={j}
                    title={mod.module}
                    scrolling='no'
                    frameBorder='0'
                    className={`col-md-${mod.grid}`}
                    style={{ height: '100%' }}
                    src={process.env.REACT_APP_PRE + mod.module}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </Wrap>
  );
};
