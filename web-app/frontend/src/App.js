import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'

import './app.css';
import SignUp from './pages/SignUp';
import Login from './pages/login';
import Index from './pages/Index';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';
import CenterItems from './containers/CenterItems';
import { checkAuthenticated } from './store/actions/auth'

axios.defaults.withCredentials = true;

function App() {
  const isAuthenticated = useSelector(state => state.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthenticated())
  }, []);

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path='/'>
            <Index>

            </Index>
          </Route>
          <Route path='/register'>
            <CenterItems>
              <SignUp/>
            </CenterItems>
          </Route>
          <Route path='/login'>
            <CenterItems>
              <Login/>
            </CenterItems>
          </Route>
          <Route exact path='/reset-password'>
            <CenterItems>
              <ResetPassword/>
            </CenterItems>
          </Route>
          <Route exact path='/reset-password/confirm/:token' component={ResetPasswordConfirm}/>
        </Switch> 
      </div>
    </Router>
  );
}

export default App;
