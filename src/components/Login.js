import React, { useState, useEffect } from 'react';

import GoogleButton from 'react-google-button';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Image from 'react-bootstrap/Image';

const AUTH = require('../controllers/auth.js');

function Login(props) {

  const[loginEmail, setLoginEmail] = useState("");
  const[loginPassword, setPassword] = useState("");
  const[registrationEmail, setRegistrationEmail] = useState("");
  const[registrationPassword, setRegistrationPassword] = useState("");

  function login() {
    if(loginEmail.trim().length === 0 || loginPassword.trim().length === 0) {
      return;
    }
    AUTH.standardLogin(loginEmail, loginPassword);
  }

  function register() {
    if(registrationEmail.trim().length === 0 || registrationPassword.trim().length === 0) {
      return;
    }
    AUTH.standardRegister(registrationEmail, registrationPassword);
  }

  return (
    <Container>
      <Row style = {{height: "10%"}}>
      </Row>
			<Row>
        <Col></Col>
				<Col>
					<Card>
						<Card.Title
							style = {{textAlign: "center", marginTop: "3%"}}
						>
              AutoHub
              <Image src = "auto.png" style = {{marginLeft: "2%", marginBottom: "2%", width: "25px", height: "25px"}}/>
						</Card.Title>
						<Card.Body>
              <Tabs defaultActiveKey = "login" id = "login-register">
                <Tab eventKey = "login" title = "Login">
                  <br/>
                  <div>
                    <Row style = {{marginBottom: "5%"}}>
                      <Col>
                        <Form.Label> <strong> Email </strong> </Form.Label>
                        <Form.Control
                          as = "input"
                          name = "loginEmail"
                          value = {loginEmail}
                          onChange = {(e) => {
                            setLoginEmail(e.target.value);
                          }}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Label> <strong> Password </strong> </Form.Label>
                        <Form.Control
                          type = "password"
                          name = "loginPassword"
                          value = {loginPassword}
                          onChange = {(e) => {
                            setPassword(e.target.value);
                          }}
                        />
                      </Col>
                    </Row>
                    <br/>
                    <Row>
                      <Col>
                        <Button variant = "secondary" onClick = {() => {login()}}> Login </Button>
                      </Col>
                    </Row>
                  </div>
                </Tab>
                <Tab eventKey = "register" title = "Register">
                  <br/>
                  <div>
                    <Row style = {{marginBottom: "5%"}}>
                      <Col>
                        <Form.Label> <strong> Email </strong> </Form.Label>
                        <Form.Control
                          as = "input"
                          name = "registrationEmail"
                          value = {registrationEmail}
                          onChange = {(e) => {
                            setRegistrationEmail(e.target.value);
                          }}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Label> <strong> Password </strong> </Form.Label>
                        <Form.Control
                          type = "password"
                          name = "registrationPassword"
                          value = {registrationPassword}
                          onChange = {(e) => {
                            setRegistrationPassword(e.target.value);
                          }}
                        />
                      </Col>
                    </Row>
                    <br/>
                    <Row>
                      <Col>
                        <Button variant = "secondary" onClick = {() => {register()}}> Register </Button>
                      </Col>
                    </Row>
                  </div>
                </Tab>
              </Tabs>
							<br/>
							<h5> Or </h5>
							<br/>
							<Row>
								<Col>
								{/*TODO: center and make google button responsive */}
									<GoogleButton
										type = "light"
                    onClick = {props.googleSignin}
									/>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Col>
				<Col></Col>
			</Row>
		</Container>
  );
}

export default Login;
