import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './app.css'
import SignUp from './pages/SignUp'
import CenterItems from './containers/CenterItems'

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path='/signup'>
            <CenterItems>
              <SignUp/>
            </CenterItems>
          </Route>
        </Switch> 
      </div>
    </Router>
  );
}

export default App;
