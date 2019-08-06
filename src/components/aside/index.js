import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SettingContext } from '../../config/context';

export default () => {
  const context = useContext(SettingContext);

  return (
    <aside className="frame-aside">
      <h1 className={!!context.name ? 'name-show' : ''}>
        <Link to="/">
          <i className="iconfont icon-gongnengdingyi" />
          <span>{context.name || ''}</span>
        </Link>
      </h1>
    </aside>
  );
};
