import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Aside from './components/aside';
import Nav from './components/nav';

function Form() {
  return <div />;
}

export default () => (
  <Router>
    <div className="frame-main">
      <Aside />
      <section className="frame-body">
        <Nav />
        <Route path="/form" component={Form} />
      </section>
    </div>
  </Router>
);
