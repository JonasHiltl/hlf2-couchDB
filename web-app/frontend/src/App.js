import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import { Provider } from 'react-redux'

import './app.css';
import SignUp from './pages/SignUp';
import NormalLoginForm from './pages/login';
import CenterItems from './containers/CenterItems';
import store from './store/store'

axios.defaults.withCredentials = true;

//axios.defauls.withcredentials = true
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authorization = async () => {
    try {
      await axios.get(
        'http://localhost:3000/account/verify', 
        {withcredentials: true}
        ).then(res =>{
          if (res) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        })

    } catch (error) {
      console.error(error.message)
    }
  };

  useEffect(() => {
    authorization();
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Switch>
            <Route exact path='/'>
              {isAuthenticated?
              <div>
                Du bist eingeloggt
              </div>:
              <div>
                nicht eingeloggt
              </div>
              }
            </Route>
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
            <Route path='/activate/:uid/:token' />
          </Switch> 
        </div>
      </Router>
    </Provider>
  );
}

export default App;
