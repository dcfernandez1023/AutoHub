import React, { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from './components/Login.js';
import AppNavbar from './components/AppNavbar.js';
import Home from './components/Home.js';
import HomeMobile from './components/HomeMobile.js';
import ScheduledServiceTypes from './pages/ScheduledServiceTypes.js';
import CarInfo from './pages/CarInfo.js';

const AUTH = require('./controllers/auth.js');
const MOBILEBREAKPOINT = 500;

function App() {

  const[userInfo, setUserInfo] = useState();
  //const[screenWidth, setScreenWidth] = useState(window.innerWidth); //pixel size of screen, used to determine when to render components for smaller devices
  const[isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    isUserSignedin();
    detectMobile();
  }, []);

  //sets userInfo state object
  //passes a call back to AUTH controller to set state object of this component
  function isUserSignedin() {
    const callback = (user) => {
      setUserInfo(user);
    }
    AUTH.isUserSignedin(callback);
  }

  //detects smaller device (mobile)
  function detectMobile() {
    //window.addEventListener("resize", setScreenWidth(window.innerWidth));
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)) {
      setIsMobile(true);
    }
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
              <Container fluid>
                <AppNavbar />
                {isMobile ?
                  <div>
                    <HomeMobile
                      userInfo = {userInfo}
                    />
                  </div>
                :
                  <div>
                    <Home
                      userInfo = {userInfo}
                    />
                  </div>
                }
              </Container>
          }
        </Route>
        <Route exact path = "/scheduledServiceTypes">
          <Container fluid>
            <AppNavbar />
            <ScheduledServiceTypes
              userInfo = {userInfo}
            />
          </Container>
        </Route>
        <Route
          path = "/carInfo/:carId"
          render = {(props) =>
            <Container fluid>
              <AppNavbar />
              <CarInfo
                {...props}
                userInfo = {userInfo}
                {...props}
              />
            </Container>
          }
        >
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
