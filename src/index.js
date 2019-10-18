import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider } from 'notistack';

import Login from './Login/index';
import Home from './Home/index';
import Header from './Header';
import './styles.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import localforage from 'localforage';
import { bulkAdd } from './util';
localforage.config({
  driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
  name: 'rsvp',
  storeName: 'rsvp',
});


const EVERY_15_SECONDS = 15 * 1000;
setInterval(bulkAdd, EVERY_15_SECONDS);

class App extends Component {
  render() {
    return (
      <Router>
        <SnackbarProvider maxSnack={3}>

        <div className="App">
          <Header />
          <div>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
          </div>
        </div>
        </SnackbarProvider>

      </Router>
    );
  }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);

serviceWorker.register();
