import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './common/bootstrap.css';
import './common/base.css';
import Aside from './components/aside';
import Nav from './components/nav';
import CreateForm from './pages/create-form';

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
