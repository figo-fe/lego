import React from 'react';
import { Link } from 'react-router-dom';

export const Nav = ({ mode }) => (
  <nav className={'frame-nav' + (mode === 'standalone' ? '' : ' frame-nav-fixed')}>
    <div className='nav-right'>
      <div className='nav-item'>
        <Link to='/setting'>
          <i className='fas fa-cog' />
          <span>系统设置</span>
        </Link>
      </div>
      <div className='nav-item'>
        <Link to='/chart/list'>
          <i className='fas fa-chart-line' />
          <span>图表管理</span>
        </Link>
      </div>
      <div className='nav-item'>
        <Link to='/table/list'>
          <i className='fas fa-table' />
          <span>列表管理</span>
        </Link>
      </div>
      <div className='nav-item'>
        <Link to='/form/list'>
          <i className='fas fa-th-list' />
          <span>表单管理</span>
        </Link>
      </div>
    </div>
  </nav>
);
