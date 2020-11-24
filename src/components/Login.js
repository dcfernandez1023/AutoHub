import React, { useState, useEffect } from 'react';

import GoogleButton from 'react-google-button';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const AUTH = require('../controllers/auth.js');

function Login(props) {

  const[registering, toggleRegistering] = useState(false);
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");

  return (
    <Container>
      <Row style = {{height: "10%"}}>
      </Row>
			<Row style = {{float: "center"}}>
				<Col></Col>
				<Col>
					<Card>
						<Card.Title
							style = {{textAlign: "center"}}
						>
              AutoHub
						</Card.Title>
						<Card.Body>
						{/*TODO: add register form */}
							{!registering ?
							<div>
								<Row>
									{/*TODO: add email & password authentication service */}
									<Col>
										<Form.Label> Email </Form.Label>
										<Form.Control
											as = "input"
											name = "email"
											value = {email}
											onChange = {(e) => {
												setEmail(e.target.value);
											}}
										/>
									</Col>
								</Row>
								<Row>
									<Col>
										<Form.Label> Password </Form.Label>
										<Form.Control
											type = "password"
											name = "password"
											value = {password}
											onChange = {(e) => {
												setPassword(e.target.value);
											}}
										/>
									</Col>
								</Row>
								<br/>
								<Row>
									<Col>
										<Button variant = "secondary"> Login </Button>
									</Col>
									<Col>
										*non-Google login in progress*
									</Col>
								</Row>
							</div>
							:
							<Row>
								<Col>
								</Col>
							</Row>
							}
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
