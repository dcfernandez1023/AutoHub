import React, { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip'

function AppNavbar() {
  return (
    <Navbar fluid style = {{backgroundColor: "#A9CCE3"}}>
      <Navbar.Brand href = "/">
        <Row>
          <Col>
            <h4> AutoHub </h4>
          </Col>
        </Row>
      </Navbar.Brand>
      <Nav className = "mr-auto">
      </Nav>
      <Nav className = "justify-content-end">
        <OverlayTrigger
          key = "scheduled-service-types"
          placement = "bottom"
          overlay = {
            <Tooltip id = "scheduled-service-type">
              Scheduled Service Types
            </Tooltip>
          }
        >
          <Button variant = "light" style = {{backgroundColor: "#A9CCE3", margin: "1%", float: "right"}}
            onClick = {() => {
              window.location.pathname = "/scheduledServiceTypes";
            }}
          >
            🛎️
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          key = "messages"
          placement = "bottom"
          overlay = {
            <Tooltip id = "message">
              Messages
            </Tooltip>
          }
        >
          <Button variant = "light" style = {{backgroundColor: "#A9CCE3", margin: "1%", float: "right"}}>
            ✉️
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          key = "profile"
          placement = "bottom"
          overlay = {
            <Tooltip id = "my-profile">
              Profile
            </Tooltip>
          }
        >
          <Button variant = "light" style = {{backgroundColor: "#A9CCE3", margin: "1%", float: "right"}}>
            👤
          </Button>
        </OverlayTrigger>
      </Nav>
    </Navbar>
  );
}

export default AppNavbar;
