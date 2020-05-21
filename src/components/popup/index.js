import React from 'react';
import './index.scss';

export const Popup = ({ width, height, padding = 15, onClose, children }) => {
  return (
    <div className='popup-mask'>
      <div className='popup-main' style={{ width, height, padding }}>
        <div className='popup-hide' title='关闭' onClick={onClose}>
          <i className='fas fa-times'></i>
        </div>
        <div className='popup-body' style={{ height: height - 15 * 2 }}>
          {children}
        </div>
      </div>
    </div>
  );
};
