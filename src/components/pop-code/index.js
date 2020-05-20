import React, { useRef } from 'react';
import { AceCode } from '../../components';

export const CodePopup = ({ onSubmit, onClose, initCode = '', demo = '', width = 800, height = 500 }) => {
  const aceRef = useRef(null);

  return (
    <div className='popup-mask'>
      <div className='popup-main' style={{ width, height, padding: 15 }}>
        <div className='popup-hide' title='关闭' onClick={onClose}>
          <i className='fas fa-times'></i>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <div style={{ marginBottom: 15, height: height - 30 - 30 - 15 }}>
              <AceCode code={initCode} type='json' onReady={ace => (aceRef.current = ace)} />
            </div>
          </div>
          <div className='col-md-12'>
            <button className='btn btn-sm btn-success mr-2' onClick={() => onSubmit(aceRef.current.getValue())}>
              确定
            </button>
            {demo.length > 0 && (
              <button
                className='btn btn-sm btn-outline-info float-right'
                onClick={() => aceRef.current.setValue(demo, 1)}>
                插入示例
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
