import React, { useState } from 'react';
import { Aside, Nav } from '../index';
import { isInFrame } from '../../common/utils';

export const Frame = ({ children }) => {
  const [foldAside, setFoldAside] = useState(false);

  return (
    <>
      {!isInFrame && <Aside fold={foldAside} />}
      <div className={'frame-body' + (isInFrame ? ' frame-hide-nav' : '')}>
        {!isInFrame && <Nav fold={foldAside} onSwitchAside={() => setFoldAside(!foldAside)} />}
        {children}
      </div>
    </>
  );
};
