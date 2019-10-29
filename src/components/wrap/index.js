import React, { useContext } from 'react';
import { SettingContext } from '../../config/context';

export const Wrap = ({ children, title = '' }) => {
  const { mode } = useContext(SettingContext);

  return (
    <div className='wrap'>
      {title.length > 0 && <div className='sitepath'>{title}</div>}
      <div className={'main-content' + (mode === 'embedded' ? ' main-content-embedded' : '')}>{children}</div>
    </div>
  );
};
