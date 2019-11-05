import React from 'react';

export const FormHelp = () => (
  <div className='guide-main'>
    <div className='guide-help'>
      <h2 className='help-title'>
        <a className='hash' href='#help' name="help">
          <i className='fas fa-link'></i>
        </a>
        Use images from GitLab Container Registry
      </h2>
      <div className='help-content'>
        <p>
          GitLab offers a simple Container Registry management panel. Go to your project and click Registry in the
          project menu. This view will show you all tags in your project and will easily allow you to delete them.
        </p>
      </div>
    </div>
  </div>
);
