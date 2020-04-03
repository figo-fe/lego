import React, { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SettingContext } from '../../config/context';
import { fixJumpUrl } from '../../common/utils';

export const Aside = ({ fold }) => {
  const { name, _menu = [] } = useContext(SettingContext);
  const [openIdx, setOpenIdx] = useState(null);

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
    'cube',
  ];

  const renderSub = (list, index) => (
    <ul className='sub-list' style={{ height: (openIdx === index ? list.length * 40 : 0) + 'px' }}>
      {list.map((item, idx) => (
        <li className='item-v2' key={idx}>
          <NavLink
            activeClassName='active'
            to={fixJumpUrl(item.url || '')}
            isActive={(match, location) => {
              let isMatch = !!match;
              if (!isMatch) {
                if (item.url && location.pathname !== '/') {
                  isMatch = item.url === location.pathname + location.search;
                }
              }
              // 展开相应子菜单
              if (isMatch && openIdx === null) {
                setOpenIdx(index);
              }
              return isMatch;
            }}>
            {item.name}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  const FixedLink = props => {
    const { idx } = props;
    if (props.to) {
      return (
        <NavLink
          className='link'
          activeClassName='active'
          to={fixJumpUrl(props.to)}
          onClick={() => setOpenIdx(openIdx === idx ? null : idx)}>
          {props.children}
        </NavLink>
      );
    } else {
      return (
        <div
          className={'link' + (openIdx === idx ? ' active' : '')}
          onClick={() => setOpenIdx(openIdx === idx ? null : idx)}>
          {props.children}
        </div>
      );
    }
  };

  return (
    <aside className={'frame-aside' + (fold ? ' frame-aside-fold' : '')}>
      <h1 className={!!name ? 'name-show' : ''}>
        <Link to='/'>
          <i className='fas fa-cubes' />
          <span>{name || ''}</span>
        </Link>
      </h1>
      <ul className='side-menu'>
        {_menu.map &&
          _menu.map((v1, idx) => (
            <li className='item-v1' key={idx}>
              <FixedLink idx={idx} to={v1.url}>
                <i className={'icon fas fa-' + (v1.icon || icons[idx])} />
                <span>{v1.name}</span>
                {v1.sub && <i className='arr fas fa-chevron-down' />}
              </FixedLink>
              {v1.sub && renderSub(v1.sub, idx)}
            </li>
          ))}
      </ul>
    </aside>
  );
};
