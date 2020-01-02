import React, { Fragment } from 'react';
import { Aside, Nav } from '../index';

export const Frame = props => {
  return (
    <Fragment>
      {props.showAside && <Aside />}
      <div className='frame-body'>
        {props.showNav && <Nav mode={props.mode} />}
        {props.children}
      </div>
    </Fragment>
  );
};
