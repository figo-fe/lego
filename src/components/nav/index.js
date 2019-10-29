import React from 'react';
import { Link } from 'react-router-dom';

export const Nav = ({ mode }) => (
  <nav className={'frame-nav' + (mode === 'embedded' ? ' frame-nav-fixed' : '')}>
    <div className='nav-right'>
      <div className='nav-item'>
        <Link to='/htm/setting'>
          <i className='fas fa-cog' />
          <span>系统设置</span>
        </Link>
      </div>
      <div className='nav-item'>
        <Link to='/htm/table/list'>
          <i className='fas fa-table' />
          <span>列表管理</span>
        </Link>
      </div>
      <div className='nav-item'>
        <Link to='/htm/form/list'>
          <i className='fas fa-list-alt' />
          <span>表单管理</span>
        </Link>
      </div>
    </div>
  </nav>
);
