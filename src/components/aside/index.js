import React from 'react';
import { Link } from 'react-router-dom';
export default () => (
  <aside className="frame-aside">
    <h1 className="name">
      <Link to="/">
        <i className="iconfont icon-gongnengdingyi" />
        <span>搜狗商城管理后台</span>
      </Link>
    </h1>
  </aside>
);
