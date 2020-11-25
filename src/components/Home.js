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
import { v4 as uuidv4 } from 'uuid';

import AppNavbar from './AppNavbar.js';

const DB = require('../controllers/db.js');
const CARMODEL = require('../models/car.js');
const GENERICFUNCTIONS = require('../controllers/genericFunctions.js');

function Home(props) {

  const[cars, setCars] = useState([]); //user's Cars
  const[newCar, setNewCar] = useState({}); //state object for creating a new car
  const[showCarModal, setShowCarModal] = useState(false); //flag to display car modal

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
          {CARMODEL.publicFields.map((field) => {
            return (
              <Row>
                <Col>
                  <Form.Label> {field.displayName} </Form.Label>
                  <Form.Control
                    as = "input"
                    name = {field.value}
                    value = {newCar[field.value]}
                    onChange = {(e) => {
                      var newCarCopy = JSON.parse(JSON.stringify(newCar));
                      var name = [e.target.name][0];
                      var value = e.target.value;
                      newCarCopy[name] = value;
                      setNewCar(newCarCopy);
                    }}
                  />
                </Col>
              </Row>
            );
          })}
          <Form style = {{marginTop: "5%"}}>
            <Form.Group>
              <Form.Label> Image </Form.Label>
              <Form.File id = "image" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant = "success" onClick = {() => {addCar()}}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
      <AppNavbar/>
      <Row style = {{marginLeft: "1%", marginTop: "1.5%"}}>
        <Col lg = {8}>
          <Row>
            <Col>
              <Button variant = "outline-dark" style = {{float: "left", marginRight: "1%"}}
                onClick = {() => {setShowCarModal(true)}}
              >
                +
              </Button>
              <h4 style = {{marginTop: "0.5%"}}> Your Cars </h4>
            </Col>
          </Row>
          <br/>
          <Row>
          {cars.length === 0 ?
            <Col>
              <h6> You have not added any cars. Click the + button to add a car 🚗 </h6>
            </Col>
            :
            <Col>
            {
              /*
              <Button variant = "light" style = {{marginRight: "1%"}}> Gallery </Button>
              <Button variant = "light"> List </Button>
              */
            }
            </Col>
          }
          </Row>

          <Row>
            {cars.map((car) => {
              return (
                <Col md = {3}>
                  <a style = {{cursor: "pointer"}}>
                    <Card border = "dark" style = {{marginBottom: "5%"}}>
                      <Card.Img variant = "top" src = "image-placeholder.png"/>
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
            })}
          </Row>
        </Col>
        <Col lg = {4}>
          <Row>
            <Col>
              <Card>
                <Card.Header>
                  Upcoming Maintenance 🛠️
                  <Button variant = "outline-dark" style = {{float: "right"}} size = "sm"> + </Button>
                </Card.Header>
                <Card.Body>
                  You have nothing scheduled for your cars.
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col>
              <Card>
                <Card.Header>
                  Your Services 🛎️
                  <Button variant = "outline-dark" style = {{float: "right"}} size = "sm"> + </Button>
                </Card.Header>
                <Card.Body>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
