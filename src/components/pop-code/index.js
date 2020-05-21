import React, { useRef } from 'react';
import { Popup, AceCode } from '../../components';
import { Button } from '../button';

export const CodePopup = ({
  onSubmit,
  onClose,
  type = 'json',
  initCode = '',
  demo = '',
  width = 800,
  height = 500,
}) => {
  const aceRef = useRef(null);

  return (
    <Popup width={width} height={height} onClose={onClose}>
      <div className='row'>
        <div className='col-md-12'>
          <div style={{ marginBottom: 15, height: height - 30 - 30 - 15 }}>
            <AceCode code={initCode} type={type} onReady={ace => (aceRef.current = ace)} />
          </div>
        </div>
        <div className='col-md-12'>
          <Button value='确定' extClass='btn-success mr-2' onClick={() => onSubmit(aceRef.current.getValue())} />
          {demo.length > 0 && (
            <Button
              value='插入示例'
              extClass='btn-outline-info float-right'
              onClick={() => aceRef.current.setValue(demo, 1)}
            />
          )}
        </div>
      </div>
    </Popup>
  );
};
