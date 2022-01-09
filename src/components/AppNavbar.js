import React, { useState, useEffect } from 'react';

import '../component-css/AppNavbar.css';

import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ListGroup from 'react-bootstrap/ListGroup';

const AUTH = require('../controllers/auth.js');

function AppNavbar(props) {
  return (
    <Navbar fluid style = {{backgroundColor: "#A9CCE3"}}>
      <Navbar.Brand href = "/">
        <Row>
          <Col>
            <h4>
              AutoHub
              <Image src = "/auto.png" style = {{width: "25px", height: "25px", marginLeft: "8px", marginBottom: "3%"}} />
            </h4>
          </Col>
        </Row>
      </Navbar.Brand>
      <Nav className = "mr-auto">
      </Nav>
      <Nav className = "justify-content-end">
        <Button variant = "light" style = {{backgroundColor: "#A9CCE3", margin: "1%", float: "right"}}
          onClick = {() => {
            window.location.pathname = "/scheduledServiceTypes";
          }}
        >
          🛎️
        </Button>
        <Dropdown>
          <Dropdown.Toggle
            variant = "light"
            style = {{backgroundColor: "#A9CCE3", margin: "1%", float: "right"}}
          >
            👤
          </Dropdown.Toggle>
          <Dropdown.Menu align = "right" style = {{border: "1px solid gray"}}>
            <Row>
              <Col>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col xs ={12} style = {{textAlign: "center"}}>
                        Signed in as:
                      </Col>
                    </Row>
                    <Row>
                      <Col style = {{textAlign: "center"}}>
                        <strong> {props.userInfo === undefined ? "" : props.userInfo.email} </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item action onClick = {() => {window.location.pathname = "/changelog"}}>
                    View Changelog
                  </ListGroup.Item>
                  <ListGroup.Item action onClick = {() => {window.open("https://formtosheets.com/e6db4457-3c82-474d-b38f-d39f5b4a8a7e", "_blank")}}>
                    Submit Feedback
                  </ListGroup.Item>
                  <ListGroup.Item action onClick = {() => {AUTH.signout()}}>
                    Signout
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </Navbar>
  );
}

export default AppNavbar;
