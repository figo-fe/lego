import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { loadJs } from './common/utils';
import * as serviceWorker from './serviceWorker';

import './common/base.css';
import Aside from './components/aside';
import Nav from './components/nav';
import CreateForm from './pages/create-form';

// 加载JSONEditor
if (!window.JSONEditor) {
  loadJs(`${process.env.PUBLIC_URL}/jsoneditor/jsoneditor.min.js`);
}

const App = () => (
  <Router>
    <div className="frame-main">
      <Aside />
      <section className="frame-body">
        <Nav />
        <Route path="/create-form" component={CreateForm} />
      </section>
    </div>
  </Router>
);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
