import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { Nav, Aside } from './components';
import { Setting } from './pages/setting';
import { GuideHome, FormHelp, TableHelp, ChartHelp, GeneralDesc } from './pages/guide';
import { FormCreate } from './pages/form/create';
import { FormList } from './pages/form/list';
import { FormEdit } from './pages/form/edit';
import { FormUse } from './pages/form/use';

import { TableEdit } from './pages/table';
import { TableList } from './pages/table/list';
import { TableUse } from './pages/table/use';

import { ChartEdit } from './pages/chart';
import { ChartList } from './pages/chart/list';
import { ChartUse } from './pages/chart/use';

import { BoardEdit } from './pages/board';

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
        const { name = '后台管理系统', baseUrl = '', mode = '', sideMenu, uploadFn } = res.data;
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
        <BrowserRouter basename={process.env.REACT_APP_PRE}>
          {showAside && <Aside />}
          <div className='frame-body'>
            {showNav && <Nav mode={setting.mode} />}
            <Switch>
              <Route exact path={['/index', '/']} render={GuideHome} />
              <Route path='/setting' render={() => <Setting updateSetting={setSetting} />} />

              <Route path='/form/create' component={FormCreate} />
              <Route path='/form/list' component={FormList} />
              <Route path='/form/edit/:id' component={FormEdit} />
              <Route path='/form/use/:id' component={FormUse} />

              <Route path='/table/create' component={TableEdit} />
              <Route path='/table/edit/:id' component={TableEdit} />
              <Route path='/table/list' component={TableList} />
              <Route path='/table/use/:id' component={TableUse} />

              <Route path='/chart/create' component={ChartEdit} />
              <Route path='/chart/edit/:id' component={ChartEdit} />
              <Route path='/chart/list' component={ChartList} />
              <Route path='/chart/use/:id' component={ChartUse} />

              <Route path='/board/create' component={BoardEdit} />

              <Route path='/help/form' component={FormHelp} />
              <Route path='/help/table' component={TableHelp} />
              <Route path='/help/chart' component={ChartHelp} />
              <Route path='/help/general' component={GeneralDesc} />
            </Switch>
          </div>
        </BrowserRouter>
      </section>
    </SettingContext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
