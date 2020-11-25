import React, { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from './components/Login.js';
import Home from './components/Home.js';

const AUTH = require('./controllers/auth.js');

function App() {

  const[userInfo, setUserInfo] = useState();

  useEffect(() => {
    isUserSignedin();
  }, []);

  //sets userInfo state object
  //passes a call back to AUTH controller to set state object of this component
  function isUserSignedin() {
    const callback = (user) => {
      setUserInfo(user);
    }
    AUTH.isUserSignedin(callback);
  }

  return (
    <Router>
      <Switch>
        <Route exact path = "/">
          {userInfo === null
            ?
              <body style = {{backgroundImage: "url('tools.gif')"}}>
                <Login
                  googleSignin = {AUTH.googleSignin}
                />
              </body>
            :
            <body>
              <Home
                userInfo = {userInfo}
              />
            </body>
          }
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
