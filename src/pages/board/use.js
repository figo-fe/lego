import React, { useEffect, useState, useRef } from 'react';
import { Wrap } from '../../components';
import { axios, buildUrl, parseUrl } from '../../common/utils';
import { BOARD } from '../../config/apis';
import './board.scss';

export const BoardUse = props => {
  const initTabIdx = parseInt(parseUrl().tabidx || '0');
  const [config, setConfig] = useState({ list: [] });
  const [tabIdx, setTabIdx] = useState(initTabIdx);
  const initMap = useRef({ [initTabIdx]: true });

  useEffect(() => {
    const id = props.match.params.id;
    axios('GET', BOARD, { id }).then(res => {
      setConfig(JSON.parse(res.data.config));
    });
  }, [props.match.params.id]);

  return (
    <Wrap>
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
      {config.list && (
        <div className={'board-mode-' + config.mode}>
          {config.list.map((block, i) => {
            if (config.mode === 'tab' && !initMap.current[i]) return null;

            return (
              <div
                className='row mb-3'
                key={block.name}
                style={{
                  height: block.height,
                  display: i === tabIdx || config.mode === 'tiled' ? 'block' : 'none',
                }}>
                {block.mods.map((mod, j) => (
                  <iframe
                    key={j}
                    title={mod.module}
                    scrolling='no'
                    frameBorder='0'
                    className={`col-md-${mod.grid}`}
                    style={{ height: mod.height ? mod.height : '100%' }}
                    src={process.env.REACT_APP_PRE + buildUrl(mod.module)}
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
