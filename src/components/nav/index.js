import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SettingContext } from '../../config/context';

export const Nav = ({ onSwitchAside }) => {
  const { _admin, _user } = useContext(SettingContext);

  return (
    <nav className='frame-nav'>
      <div className='nav-switch-aside' onClick={onSwitchAside}>
        <i className='fas fa-bars' />
      </div>
      <div style={{ flex: 1 }}></div>
      {_user && (
        <div className='nav-user'>
          <i className='fas fa-user' />
          欢迎你，{_user}
        </div>
      )}
      {_admin && (
        <div className='nav-dropdown'>
          <i className='fas fa-th-large dropdown-icon' />
          <ul className='nav-dropdown-menu'>
            <li>
              <Link to='/form/list'>
                <i className='fas fa-th-list' />
                <span>表单管理</span>
              </Link>
            </li>
            <li>
              <Link to='/table/list'>
                <i className='fas fa-table' />
                <span>列表管理</span>
              </Link>
            </li>
            <li>
              <Link to='/chart/list'>
                <i className='fas fa-chart-line' />
                <span>图表管理</span>
              </Link>
            </li>
            <li>
              <Link to='/board/list'>
                <i className='fas fa-tachometer-alt' />
                <span>面板管理</span>
              </Link>
            </li>
            <li>
              <Link to='/setting'>
                <i className='fas fa-cog' />
                <span>系统设置</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};
