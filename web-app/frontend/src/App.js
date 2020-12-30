import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import './app.css';
import SignUp from './pages/SignUp';
import NormalLoginForm from './pages/login';
import CenterItems from './containers/CenterItems';

//axios.defauls.withcredentials = true
function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path='/register'>
            <CenterItems>
              <SignUp/>
            </CenterItems>
          </Route>
          <Route path='/login'>
            <CenterItems>
              <NormalLoginForm/>
            </CenterItems>
          </Route>
        </Switch> 
      </div>
    </Router>
  );
}

export default App;
