import React, { useRef } from 'react';
import { axios } from '../../common/utils';
import './login.scss';

export const Login = props => {
  const usr = useRef(null);
  const pwd = useRef(null);

  function doLogin() {
    const params = {};
    params[process.env.REACT_APP_LOGIN_USRNAME] = usr.current.value;
    params[process.env.REACT_APP_LOGIN_PWDNAME] = pwd.current.value;

    axios('POST', process.env.REACT_APP_LOGIN_API, params).then(data => {
      console.log('login', data);
      window.location.assign(process.env.REACT_APP_PRE);
    });
  }
  return (
    <div className='lego-login'>
      <div className='login-main'>
        <div className='login-box'>
          <div className='login-title'>后台管理系统</div>
          <div className='login-form'>
            <div className='login-input'>
              <i className='fas fa-user'></i>
              <input type='text' placeholder='请输入用户名' ref={usr} />
            </div>
            <div className='login-input'>
              <i className='fas fa-unlock'></i>
              <input type='password' placeholder='请输入密码' ref={pwd} />
            </div>
            <div className='login-btn' onClick={doLogin}>
              登 录
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
