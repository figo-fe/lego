import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { Nav, Aside } from './components';
import { Setting } from './pages/setting';
import { FormCreate } from './pages/form/create';
import { FormList } from './pages/form/list';
import { FormEdit } from './pages/form/edit';
import { FormUse } from './pages/form/use';
import { TableEdit } from './pages/table';
import { TableList } from './pages/table/list';
import { SettingContext } from './config/context';
import { axios, execJs } from './common/utils';
import { SETTING } from './config/apis';

import './common/bootstrap.css';
import './common/base.css';

const App = () => {
  const [setting, setSetting] = useState({});

  useEffect(() => {
    axios('GET', SETTING)
      .then(res => {
        const { name = '后台管理系统', baseUrl, sideMenu, uploadFn } = res.data;
        setSetting({ name, baseUrl, sideMenu, uploadFn });
      })
      .catch(err => {
        console.warn(err);
      });
  }, []);

  useEffect(() => {
    let fn = '';
    try {
      // 挂载上传方法
      if (setting.uploadFn) {
        fn = execJs(setting.uploadFn);
        console.log('UploadFn mounted!');
      }
    } catch (err) {
      console.warn(err);
    }
    return () => {
      if (fn.length > 0) {
        window[fn] = null;
      }
    };
  }, [setting.uploadFn]);

  return (
    <SettingContext.Provider value={setting}>
      <section className='frame-main'>
        <Router>
          <Aside />
          <div className='frame-body'>
            <Nav />

            <Route path='/htm/setting' render={() => <Setting updateSetting={setSetting} />} />
            <Route path='/htm/form/create' component={FormCreate} />
            <Route path='/htm/form/list' component={FormList} />
            <Route path='/htm/form/edit/:id' component={FormEdit} />
            <Route path='/htm/form/use/:id' component={FormUse} />
            <Route path='/htm/table/create' component={TableEdit} />
            <Route path='/htm/table/edit/:id' component={TableEdit} />
            <Route path='/htm/table/list' component={TableList} />
          </div>
        </Router>
      </section>
    </SettingContext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
