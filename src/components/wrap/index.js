import React from 'react';

export const Wrap = ({ children, title = '' }) => {
  return (
    <div className='wrap'>
      {title.length > 0 && <div className='sitepath'>{title}</div>}
      <div className='main-content'>{children}</div>
    </div>
  );
};
