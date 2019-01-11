import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Login from './Login/index';
import Home from './Home/index';
import Header from './Header';
import './styles.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
serviceWorker.register();

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <div>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
          </div>
        </div>
      </Router>
    );
  }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
