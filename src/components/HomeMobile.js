import React, { useState, useEffect } from 'react';

import '../component-css/Home.css';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import Figure from 'react-bootstrap/Figure';
import { v4 as uuidv4 } from 'uuid';

const DB = require('../controllers/db.js');
const CARMODEL = require('../models/car.js');
const GENERICFUNCTIONS = require('../controllers/genericFunctions.js');

function HomeMobile(props) {

  const[cars, setCars] = useState(); //user's Cars
  const[newCar, setNewCar] = useState({}); //state object for creating a new car
  const[showCarModal, setShowCarModal] = useState(false); //flag to display car modal
  const[isListView, setIsListView] = useState(true); //flag to toggle the mode of displaying cars (list vs. grid)
  const[carModalFormValidated, setCarModalFormValidated] = useState(false); //flag to toggle form validation of the car modal

  useEffect(() => {
    getCars();
    setNewCar(CARMODEL.car);
  }, [props.userInfo])

  //CAR FUNCTIONS

  //gets all of the user's cars from db & sets a listener on the car collection with documents matching the user's email
  function getCars() {
    if(props.userInfo === undefined) {
      return;
    }
    DB.getQuerey("userCreated", props.userInfo.email, "cars").onSnapshot(quereySnapshot => {
      var cars = [];
      console.log(cars);
      for(var i = 0; i < quereySnapshot.docs.length; i++) {
        cars.push(quereySnapshot.docs[i].data());
      }
      setCars(cars);
    });
  }

  //adds a car to the cars db collectionName
  function addCar() {
    if(props.userInfo === undefined) {
      //TODO: handle this error more elegantly
      alert("User data undefined. Cannot add new car");
    }
    //TODO: add input validation
    var userCreated = props.userInfo.email;
    var carId = uuidv4().toString() + new Date().getTime();
    var imageId = uuidv4().toString() + GENERICFUNCTIONS.getRandomString();
    newCar.userCreated = userCreated;
    newCar.carId = carId;
    newCar.imageId = imageId;
    DB.writeOne(carId, newCar, "cars",
      function() {
        handleCarModalClose();
      },
      function(error) {
        //TODO: handle this error more elegantly
        alert(error.toString());
      }
    );
  }

  //function to handle car modal closing
  function handleCarModalClose() {
    setNewCar(CARMODEL.car);
    setShowCarModal(false);
    setCarModalFormValidated(false);
  }

  //function to handle adding values to newCar
  function onChangeNewCar(e) {
    var newCarCopy = JSON.parse(JSON.stringify(newCar));
    var name = [e.target.name][0];
    var value = e.target.value;
    newCarCopy[name] = value;
    setNewCar(newCarCopy);
    setCarModalFormValidated(false);
  }

  //handle submit for car modal form
  function handleCarModalSubmit(e) {
    const form = e.currentTarget;
    setCarModalFormValidated(true);
    if(checkNewCarFields() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    else {
      addCar();
    }
  }

  //check if required fields have been filled
  function checkNewCarFields() {
    var isValid = true;
    for(var i = 0; i < CARMODEL.publicFields.length; i++) {
      var field = CARMODEL.publicFields[i];
      if(field.required && newCar[field.value].toString().trim().length === 0) {
        newCar[field.value] = "";
        isValid = false;
      }
    }
    return isValid;
  }

  if(cars === undefined) {
    return (
      <Container fluid>
        <div style = {{textAlign: "center", marginTop: "1%"}}>
          <Spinner animation = "border"/>
        </div>
      </Container>
    );
  }
  return (
    <Container fluid>
      <Modal
        show = {showCarModal}
        onHide = {handleCarModalClose}
        backdrop = "static"
        keyboard = {false}
      >
        <Modal.Header closeButton>
          <Modal.Title> Add Car </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated = {carModalFormValidated} onSubmit = {handleCarModalSubmit}>
            <Row style = {{marginLeft: "3%", marginRight: "3%"}}>
              {CARMODEL.publicFields.map((field) => {
                if(field.inputType === "input") {
                  return (
                      <Col md = {field.modalColSpan} style = {{marginBottom: "1%"}}>
                        <Form.Label> {field.displayName} </Form.Label>
                        <Form.Control
                          required = {field.required}
                          as = {field.inputType}
                          name = {field.value}
                          value = {newCar[field.value]}
                          onChange = {(e) => {
                            onChangeNewCar(e);
                          }}
                        />
                        <Form.Control.Feedback type = "invalid">
                          Required
                        </Form.Control.Feedback>
                      </Col>
                  );
                }
                else if(field.inputType === "select") {
                  return (
                      <Col md = {field.modalColSpan} style = {{marginBottom: "1%"}}>
                        <Form.Label> {field.displayName} </Form.Label>
                        <Form.Control
                          required = {field.required}
                          as = {field.inputType}
                          name = {field.value}
                          onChange = {(e) => {
                            onChangeNewCar(e);
                          }}
                        >
                          <option value = "" selected disabled hidden> Year </option>
                            {field.modalSelectData.map((data) => {
                              return (
                                <option value = {data}> {data} </option>
                              );
                            })}
                        </Form.Control>
                        <Form.Control.Feedback type = "invalid">
                          Required
                        </Form.Control.Feedback>
                      </Col>
                  );
                }
                else {
                  return (
                      <Col md = {field.modalColSpan} style = {{marginBottom: "1%"}}>
                        <Form.Label> {field.displayName} </Form.Label>
                        <Form.Control
                          required = {field.required}
                          as = {field.inputType}
                          name = {field.value}
                          value = {newCar[field.value]}
                          onChange = {(e) => {
                            onChangeNewCar(e);
                          }}
                        />
                      </Col>
                  );
                }
              })}
            </Row>
            <Row>
              <Col>
                <Form>
                  <Form.Group>
                    <Form.Label> Image </Form.Label>
                    <Form.File id = "image" />
                  </Form.Group>
                </Form>
              </Col>
              <Col>
                <Button type = "submit" variant = "success" style = {{float: "right", marginTop: "10%"}}>
                  Add
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
      <Row style = {{marginTop: "5%"}}>
        <Col>
          <Row>
            <Button variant = "outline-dark" style = {{marginRight: "3%"}}
              onClick = {() => {setShowCarModal(true)}}
            >
              +
            </Button>
            <h4 style = {{marginTop: "0.5%"}}> Your Cars </h4>
          </Row>
          {cars.length === 0 ?
            <div></div>
          :
            <div>
              <br/>
              <Row style = {{textAlign: "center"}}>
                <Col>
                  <Button variant = "light" style = {{marginRight: "1%"}}
                    onClick = {() => {setIsListView(true)}}
                  >
                    <i class = "fa fa-bars"> </i> List
                  </Button>
                </Col>
                <Col>
                  <Button variant = "light"
                    onClick = {() => {setIsListView(false)}}
                  >
                    <i class = "fa fa-th-large"> </i> Grid
                  </Button>
                </Col>
              </Row>
            </div>
          }
          <br/>
          <Row>
          {cars.length === 0 ?
            <Col style = {{marginBottom: "10%"}}>
              <h6> You have not added any cars. Click the + button to add a car 🚗 </h6>
            </Col>
            :
            <div></div>
          }
          </Row>
          <Row>
            {cars.map((car, index) => {
              var style = {};
              if(index === cars.length - 1) {
                var style = {marginBottom: "5%"};
              }
              if(isListView) {
                return (
                  <Col xs = {12} style = {style}>
                    <ListGroup horizontal>
                      <ListGroup.Item action style = {{width: "100%"}}>
                        <Row>
                          <Col xs = {5}>
                            <Figure style = {{height: "50px", marginTop: "1%"}}>
                              <Figure.Image
                                width = {100}
                                height = {100}
                                src = "car-holder.png"
                              />
                            </Figure>
                          </Col>
                          <Col xs = {7} style = {{float: "right"}}>
                            <Row>
                              <Col>
                                <p> <b> {car.name} </b> </p>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <p> {car.year + " " + " " + car.make + " " + car.model} </p>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <p> <Badge pills variant = "light"> {car.mileage + " miles"} </Badge> </p>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                );
              }
              else {
                return (
                  <Col md = {3} style = {{marginBottom: "5%"}}>
                    <a style = {{cursor: "pointer"}}>
                      <Card border = "dark">
                        <Card.Img variant = "top" src = "car-holder.png"/>
                        <Card.Body>
                          <Row>
                            <Col>
                              <p> <b> {car.name} </b> </p>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <p> {car.year + " " + " " + car.make + " " + car.model} </p>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <p> <Badge pills variant = "light"> {car.mileage + " miles"} </Badge> </p>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </a>
                  </Col>
                );
              }
            })}
          </Row>
        </Col>
        <Col lg = {5}>
          <Row>
            <Col>
              <Card>
                <Card.Header>
                  Upcoming Maintenance 🛠️
                  <Button
                    variant = "outline-dark"
                    style = {{float: "right"}}
                    size = "sm"
                    disabled = {cars.length === 0}
                  >
                    +
                  </Button>
                </Card.Header>
                <Card.Body>
                  You have nothing scheduled for your cars.
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default HomeMobile;
