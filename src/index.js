import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { Home } from './pages/home';
import { Frame } from './components';
import { Setting } from './pages/setting';
import { SettingHelp, FormHelp, TableHelp, ChartHelp, GeneralDesc } from './pages/guide';

import { FormEdit } from './pages/form';
import { FormList } from './pages/form/list';
import { FormUse } from './pages/form/use';

import { TableEdit } from './pages/table';
import { TableList } from './pages/table/list';
import { TableUse } from './pages/table/use';

import { ChartEdit } from './pages/chart';
import { ChartList } from './pages/chart/list';
import { ChartUse } from './pages/chart/use';

import { BoardEdit } from './pages/board';
import { BoardList } from './pages/board/list';
import { BoardUse } from './pages/board/use';

import { Login } from './pages/ext';
import { LogList } from './pages/log/list';

import { SettingContext } from './config/context';
import { axios, execJs, buildApi, toast } from './common/utils';
import { SETTING } from './config/apis';

import './common/bootstrap.css';
import './common/base.scss';

const App = () => {
  const [setting, setSetting] = useState({});

  // 获取系统配置和权限
  useEffect(() => {
    // 登录页不加载配置
    if (window.location.pathname.indexOf('/login') > 0) return;

    axios('GET', SETTING)
      .then(async res => {
        let {
          name = '后台管理系统',
          baseUrl = '',
          permissionApi = '',
          sideMenu = '',
          uploadFn = '',
          config = '',
        } = res.data;

        let _menu = []; // 边栏菜单
        let _admin = false; // 是否有管理权限
        let _user = ''; // 用户名
        let _group = ''; // 用户组

        let { homeUrl = '' } = JSON.parse(config || '{}'); // 扩展配置

        // 设置页面title
        document.title = name;

        if (permissionApi) {
          try {
            // 请求权限接口
            const resp = await axios('GET', buildApi(baseUrl, permissionApi));
            if (sideMenu.indexOf('function main') === 0) {
              // 管理员显示系统菜单
              // eslint-disable-next-line no-new-func
              const data = new Function(`return ${sideMenu}`)()(resp.data);
              _menu = data.menu || [];
              _admin = data.admin || false;
              _user = data.user || '';
              _group = data.group || '';
            } else {
              toast('请在系统设置中定义权限/菜单配置函数！');
            }
          } catch (err) {
            console.warn('PermissionApi Error:', err);
          }
        } else {
          try {
            _menu = JSON.parse(sideMenu);
          } catch (e) {
            console.warn('Menu config error:', String(e));
          }
          _admin = true;
        }

        // _menu 必须为数组
        if (!Array.isArray(_menu)) {
          console.error('Menu must be an Array!');
          _menu = [];
        }

        setSetting({
          name,
          homeUrl,
          baseUrl,
          permissionApi,
          sideMenu,
          uploadFn,
          _menu,
          _admin,
          _user,
          _group,
        });
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
          <Switch>
            <Route path='/login' component={Login} />
            <Frame>
              <Route
                exact
                path={['/index', '/']}
                render={({ history }) => <Home history={history} homeUrl={setting.homeUrl} />}
              />
              <Route path='/setting' component={Setting} />
              <Route path='/form/create' component={FormEdit} />
              <Route path='/form/edit/:id' component={FormEdit} />
              <Route path='/form/list' component={FormList} />
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
              <Route path='/board/edit/:id' component={BoardEdit} />
              <Route path='/board/list' component={BoardList} />
              <Route path='/board/use/:id' component={BoardUse} />

              <Route path='/help/setting' component={SettingHelp} />
              <Route path='/help/form' component={FormHelp} />
              <Route path='/help/table' component={TableHelp} />
              <Route path='/help/chart' component={ChartHelp} />
              <Route path='/help/general' component={GeneralDesc} />

              <Route path='/log/list' component={LogList} />
            </Frame>
          </Switch>
        </BrowserRouter>
      </section>
    </SettingContext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
