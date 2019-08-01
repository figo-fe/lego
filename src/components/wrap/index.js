import React from 'react';

export default ({ children, title = '' }) => {
  return (
    <div className="wrap">
      {title.length > 0 && <div className="sitepath">{title}</div>}
      <div className="main-content">{children}</div>
    </div>
  );
};
