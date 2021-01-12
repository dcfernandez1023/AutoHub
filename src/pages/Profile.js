import React, { useState, useEffect } from 'react';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

const AUTH = require('../controllers/auth.js');

function Profile(props) {

  if(props.userInfo === undefined || props.userInfo === null) {
    return (
      <Container fluid>
        <div style = {{textAlign: "center", marginTop: "3%"}}>
          <Spinner animation = "grow"/>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <br/>
      <Row>
        <Col>
          <Card>
            <Card.Header> Profile </Card.Header>
            <Card.Body>
              <Row>
                <Col>
                  Signed in as: <strong> {props.userInfo.email} </strong>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col style = {{textAlign: "center"}}>
          <Button
            onClick = {() => {AUTH.signout()}}
          >
            Signout
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
