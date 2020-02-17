import React, { Fragment } from 'react';
import { Aside, Nav } from '../index';
import { isInFrame } from '../../common/utils';

export const Frame = ({ showAside, showNav, mode, children }) => {
  return (
    <Fragment>
      {showAside && <Aside />}
      <div className={'frame-body' + (!showNav || isInFrame || mode === 'embedded' ? ' frame-hide-nav' : '')}>
        {showNav && <Nav mode={mode} />}
        {children}
      </div>
    </Fragment>
  );
};
