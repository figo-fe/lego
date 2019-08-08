import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <nav className="frame-nav">
    <i className="fas fa-outdent menu-fold" />
    <div className="nav-right">
      <div className="nav-item">
        <i className="fas fa-cog" />
        <div className="dropdown">
          <div className="list-box">
            <Link to="/htm/setting">
              <i className="fas fa-wrench" />
              <span>系统设置</span>
            </Link>
            <Link to="/htm/form/list">
              <i className="fas fa-list-alt" />
              <span>所有表单</span>
            </Link>
            <Link to="/htm/table/list">
              <i className="fas fa-table" />
              <span>所有列表</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </nav>
);
