import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { SettingContext } from '../../config/context';

export default () => {
  const context = useContext(SettingContext);
  const [openIdx, setOpenIdx] = useState(0);
  const parseMenu = () => {
    try {
      return JSON.parse(context.sideMenu);
    } catch (e) {
      return [];
    }
  };

  const icons = [
    'edit',
    'laptop',
    'gem',
    'th-list',
    'newspaper',
    'map',
    'network-wired',
    'desktop',
    'list',
    'parachute-box',
    'microsoft',
    'paper-plane',
    'cube'
  ];

  const renderSub = (list, idx) => (
    <ul
      className="sub-list"
      style={{ height: (openIdx === idx ? list.length * 40 : 0) + 'px' }}
    >
      {list.map((item, idx) => (
        <li className="item-v2" key={idx}>
          <Link to={item.url}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );

  return (
    <aside className="frame-aside">
      <h1 className={!!context.name ? 'name-show' : ''}>
        <Link to="/">
          <i className="fas fa-cubes" />
          <span>{context.name || ''}</span>
        </Link>
      </h1>
      <ul className="side-menu">
        {parseMenu().map((v1, idx) => (
          <li className="item-v1" key={idx}>
            <Link to={v1.url} onClick={() => setOpenIdx(idx)}>
              <i className={'icon fas fa-' + (v1.icon || icons[idx])} />
              <span>{v1.name}</span>
              <i className="arr fas fa-chevron-down" />
            </Link>
            {v1.sub && renderSub(v1.sub, idx)}
          </li>
        ))}
      </ul>
    </aside>
  );
};
