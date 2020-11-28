import React, { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

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
        <Button size = "lg" variant = "light" style = {{backgroundColor: "#A9CCE3", margin: "1%", float: "right"}}>
          🛎️
        </Button>
        <Button size = "lg" variant = "light" style = {{backgroundColor: "#A9CCE3", margin: "1%", float: "right"}}>
          ✉️
        </Button>
        <Button size = "lg" variant = "light" style = {{backgroundColor: "#A9CCE3", margin: "1%", float: "right"}}>
          👤
        </Button>
      </Nav>
    </Navbar>
  );
}

export default AppNavbar;
