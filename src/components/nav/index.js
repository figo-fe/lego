import React from 'react';
import { Link } from 'react-router-dom';

export const Nav = () => (
  <nav className='frame-nav'>
    {/* <i className="fas fa-outdent menu-fold" /> */}
    <div className='nav-right'>
      <div className='nav-item'>
        <i className='fas fa-cog' />
        <div className='dropdown'>
          <div className='list-box'>
            <Link to='/htm/setting'>
              <i className='fas fa-wrench' />
              <span>系统设置</span>
            </Link>
            <Link to='/htm/form/list'>
              <i className='fas fa-list-alt' />
              <span>表单管理</span>
            </Link>
            <Link to='/htm/table/list'>
              <i className='fas fa-table' />
              <span>列表管理</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </nav>
);
