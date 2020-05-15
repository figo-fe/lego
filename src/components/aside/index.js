import React, { useState, useContext, useEffect } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { SettingContext } from '../../config/context';
import { fixJumpUrl } from '../../common/utils';

export const _Aside = ({ location, fold }) => {
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

  useEffect(() => {
    // 展开父级菜单
    if (_menu.length > 0) {
      console.log(111)
      let _openIdx = 0;
      _menu.forEach(({ sub = [] }, idx) => {
        sub.forEach(lnk => {
          if (lnk.url.indexOf(location.pathname) >= 0) {
            _openIdx = idx;
          }
        });
      });

      setOpenIdx(_openIdx);
    }
  }, [location.pathname, _menu]);

  const renderSubLink = (list = [], index) => (
    <ul className='sub-list' style={{ height: (openIdx === index ? list.length * 40 + 10 : 0) + 'px' }}>
      {list.map((item, idx) => (
        <li className='item-v2' key={idx}>
          <NavLink activeClassName='active' to={fixJumpUrl(item.url || '')}>
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
        {_menu.map((v1, idx) => (
          <li className='item-v1' key={idx}>
            <FixedLink idx={idx} to={v1.url}>
              <i className={'icon fas fa-' + (v1.icon || icons[idx])} />
              <span>{v1.name}</span>
              {v1.sub && <i className='arr fas fa-chevron-down' />}
            </FixedLink>
            {v1.sub && renderSubLink(v1.sub, idx)}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export const Aside = withRouter(_Aside);
