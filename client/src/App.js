import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import PagePlayer from './components/pages/Player';
import PageSeason from './components/pages/Season';
import About from './components/pages/About';
import Login from './components/auth/Login';
import Alerts from './components/layout/Alerts';
import PrivateRoute from './components/routing/PrivateRoute';
import PlayerState from './context/player/PlayerState';
import SeasonState from './context/season/SeasonState';
import AuthState from './context/auth/AuthState';
import AlertState from './context/alert/AlertState';
import 'materialize-css';

import 'materialize-css/dist/css/materialize.min.css';
import './App.css';

const App = () => {
  useEffect(() => {});

  return (
    <AuthState>
      <PlayerState>
        <SeasonState>
          <AlertState>
            <Router>
              <Fragment>
                <Navbar />
                <div className='container'>
                  <Alerts />
                  <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/player' component={PagePlayer} />
                    <PrivateRoute exact path='/season' component={PageSeason} />
                    <Route exact path='/about' component={About} />
                    <Route exact path='/login' component={Login} />
                  </Switch>
                </div>
              </Fragment>
            </Router>
          </AlertState>
        </SeasonState>
      </PlayerState>
    </AuthState>
  );
};

export default App;
