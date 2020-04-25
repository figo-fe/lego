import React, { useRef } from 'react';
import { axios, md5, toast } from '../../common/utils';
import { langs, lang } from '@lang';

import './login.scss';

export const Login = props => {
  const usr = useRef(null);
  const pwd = useRef(null);

  function doLogin() {
    const params = {};
    if (usr.current.value && pwd.current.value) {
      params[process.env.REACT_APP_LOGIN_USRNAME] = usr.current.value;
      params[process.env.REACT_APP_LOGIN_PWDNAME] = md5(pwd.current.value);

      axios('POST', process.env.REACT_APP_LOGIN_API, params).then(data => {
        console.log('login', data);
        window.location.replace(`${process.env.REACT_APP_PRE}/`);
      });
    } else {
      toast(langs[lang]['usr_pwd_empty']);
    }
  }
  return (
    <div className='lego-login'>
      <div className='login-main'>
        <div className='login-box'>
          <div className='login-title'>{langs[lang]['admin_name']}</div>
          <div className='login-form'>
            <div className='login-input'>
              <i className='fas fa-user'></i>
              <input type='text' placeholder={`${langs[lang]['please_enter']}${langs[lang]['usr']}`} ref={usr} />
            </div>
            <div className='login-input'>
              <i className='fas fa-unlock'></i>
              <input type='password' placeholder={`${langs[lang]['please_enter']}${langs[lang]['pwd']}`} ref={pwd} />
            </div>
            <div className='login-btn' onClick={doLogin}>
              {langs[lang]['login']}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
