import React, { useContext } from 'react';
import { SettingContext } from '../../config/context';
import { isInFrame } from '../../common/utils';

export const Wrap = ({ children, title = '', loading = false }) => {
  const { mode } = useContext(SettingContext);

  return (
    <div className='wrap'>
      {title.length > 0 && <div className='sitepath'>{title}</div>}
      <div
        className={'main-content' + (mode === 'standalone' ? '' : ' main-content-embedded')}
        style={{ padding: isInFrame ? 0 : null }}>
        {loading ? <div className='lego-card'>loading...</div> : children}
      </div>
    </div>
  );
};
