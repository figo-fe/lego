import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Aside from './components/aside';
import Nav from './components/nav';
import Setting from './pages/setting';
import FormCreate from './pages/form/create';
import { SettingContext } from './config/context';
import { axios } from './common/utils';
import { SETTING } from './common/apis';

import './common/bootstrap.css';
import './common/base.css';

const App = () => {
  const [setting, setSetting] = useState({});

  useEffect(() => {
    axios('GET', SETTING)
      .then(res => {
        const { name, baseUrl, sideMenu, uploadFn } = res.data;
        setSetting({ name, baseUrl, sideMenu, uploadFn });
      })
      .catch(err => {
        console.warn(err);
      });
  }, []);

  return (
    <SettingContext.Provider value={setting}>
      <Router>
        <div className="frame-main">
          <Aside />
          <section className="frame-body">
            <Nav />
            <Route
              path="/htm/setting"
              render={() => <Setting updateSetting={setSetting} />}
            />
            <Route path="/htm/form/create" component={FormCreate} />
          </section>
        </div>
      </Router>
    </SettingContext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
