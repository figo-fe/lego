import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import { Nav, Aside } from './components';
import { Setting } from './pages/setting';
import { GuideHome, FormHelp, TableHelp, GeneralDesc } from './pages/guide';
import { FormCreate } from './pages/form/create';
import { FormList } from './pages/form/list';
import { FormEdit } from './pages/form/edit';
import { FormUse } from './pages/form/use';
import { TableEdit } from './pages/table';
import { TableList } from './pages/table/list';
import { TableUse } from './pages/table/use';
import { SettingContext } from './config/context';
import { axios, execJs } from './common/utils';
import { SETTING } from './config/apis';

import { isInFrame } from './common/utils';

import './common/bootstrap.css';
import './common/base.scss';

const App = () => {
  const [setting, setSetting] = useState({});
  const showNav = !isInFrame;
  const showAside = !isInFrame && setting.mode === 'standalone';

  useEffect(() => {
    axios('GET', SETTING)
      .then(res => {
        const { name = '后台管理系统', baseUrl, mode, sideMenu, uploadFn } = res.data;
        setSetting({ name, baseUrl, mode, sideMenu, uploadFn });
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
        console.log('FileUploader mounted!');
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
        <BrowserRouter>
          {showAside && <Aside />}
          <div className='frame-body'>
            {showNav && <Nav mode={setting.mode} />}
            <Switch>
              <Redirect exact path='/' to='/htm/index' />
              <Route path='/htm/index' render={GuideHome} />
              <Route path='/htm/setting' render={() => <Setting updateSetting={setSetting} />} />
              <Route path='/htm/form/create' component={FormCreate} />
              <Route path='/htm/form/list' component={FormList} />
              <Route path='/htm/form/edit/:id' component={FormEdit} />
              <Route path='/htm/form/use/:id' component={FormUse} />
              <Route path='/htm/table/create' component={TableEdit} />
              <Route path='/htm/table/edit/:id' component={TableEdit} />
              <Route path='/htm/table/list' component={TableList} />
              <Route path='/htm/table/use/:id' component={TableUse} />

              <Route path='/htm/help/form' component={FormHelp} />
              <Route path='/htm/help/table' component={TableHelp} />
              <Route path='/htm/help/general' component={GeneralDesc} />
            </Switch>
          </div>
        </BrowserRouter>
      </section>
    </SettingContext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
