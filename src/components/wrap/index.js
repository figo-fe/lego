import React from 'react';
import { isInFrame } from '../../common/utils';

export const Wrap = ({ children, title = '', loading = false }) => {
  return (
    <div className='wrap'>
      {title.length > 0 && <div className='sitepath'>{title}</div>}
      <div className='main-content' style={{ padding: isInFrame ? 0 : null }}>
        {loading ? <div className='lego-card'>loading...</div> : children}
      </div>
    </div>
  );
};
