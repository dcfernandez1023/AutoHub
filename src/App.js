import React, { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {ErrorBoundary} from 'react-error-boundary';

import Login from './components/Login.js';
import AppNavbar from './components/AppNavbar.js';
import Home from './components/Home.js';
import HomeMobile from './components/HomeMobile.js';
import ScheduledServiceTypes from './pages/ScheduledServiceTypes.js';
import CarInfo from './pages/CarInfo.js';
import ErrorHandler from './components/ErrorHandler.js';

const AUTH = require('./controllers/auth.js');
const MOBILEBREAKPOINT = 500;

function App() {

  const[userInfo, setUserInfo] = useState();
  //const[screenWidth, setScreenWidth] = useState(window.innerWidth); //pixel size of screen, used to determine when to render components for smaller devices
  const[isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    isUserSignedin();
    detectMobile();
  });

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
              <body style = {{backgroundColor: "#A9CCE3"}}>
                <ErrorBoundary
                  FallbackComponent = {ErrorHandler}
                  onReset = {() => {
                    window.location.pathname = "/";
                  }}
                >
                  <Login
                    googleSignin = {AUTH.googleSignin}
                  />
                </ErrorBoundary>
              </body>
            :
              <Container fluid>
                <AppNavbar
                  userInfo = {userInfo}
                />
                {isMobile ?
                  <div>
                    <ErrorBoundary
                      FallbackComponent = {ErrorHandler}
                      onReset = {() => {
                        window.location.pathname = "/";
                      }}
                    >
                      <HomeMobile
                        userInfo = {userInfo}
                      />
                    </ErrorBoundary>
                  </div>
                :
                  <div>
                    <ErrorBoundary
                      FallbackComponent = {ErrorHandler}
                      onReset = {() => {
                        window.location.pathname = "/";
                      }}
                    >
                      <Home
                        userInfo = {userInfo}
                      />
                    </ErrorBoundary>
                  </div>
                }
              </Container>
          }
        </Route>
        <Route exact path = "/scheduledServiceTypes">
          <Container fluid>
            <AppNavbar
              userInfo = {userInfo}
            />
            <ErrorBoundary
              FallbackComponent = {ErrorHandler}
              onReset = {() => {
                window.location.pathname = "/scheduledServiceTypes";
              }}
            >
              <ScheduledServiceTypes
                userInfo = {userInfo}
              />
            </ErrorBoundary>
          </Container>
        </Route>
        <Route
          path = "/carInfo/:carId"
          render = {(props) =>
            <Container fluid>
              <AppNavbar
                userInfo = {userInfo}
              />
              <ErrorBoundary
                FallbackComponent = {ErrorHandler}
                onReset = {() => {
                  window.location.pathname = "/";
                }}
              >
                <CarInfo
                  {...props}
                  userInfo = {userInfo}
                  {...props}
                />
              </ErrorBoundary>
            </Container>
          }
        >
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
