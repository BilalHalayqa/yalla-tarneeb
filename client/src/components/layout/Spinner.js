import React, { Fragment } from 'react';

export default () => (
  <Fragment>
    <div
      className='preloader-wrapper big active'
      style={{ marginLeft: '50%', marginTop: '10%', overflow: 'hidden' }}
    >
      <div className='spinner-layer spinner-teal-only'>
        <div className='circle-clipper left'>
          <div className='circle'></div>
        </div>
        <div className='gap-patch'>
          <div className='circle'></div>
        </div>
        <div className='circle-clipper right'>
          <div className='circle'></div>
        </div>
      </div>
    </div>
  </Fragment>
);
