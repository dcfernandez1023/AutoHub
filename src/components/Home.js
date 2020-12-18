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
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import Figure from 'react-bootstrap/Figure';
import { v4 as uuidv4 } from 'uuid';

import CarModal from './CarModal.js';

const DB = require('../controllers/db.js');
const STORAGE = require('../controllers/storage.js');
const CARMODEL = require('../models/car.js');
const GENERICFUNCTIONS = require('../controllers/genericFunctions.js');

function Home(props) {

  const[showCarModal, setShowCarModal] = useState(false); //flag to display car modal
  const[cars, setCars] = useState(); //user's Cars
  const[isListView, setIsListView] = useState(false); //flag to toggle the mode of displaying cars (list vs. grid)

  useEffect(() => {
    getCars();
  }, [props.userInfo])

  //CAR FUNCTIONS

  //gets all of the user's cars from db & sets a listener on the car collection with documents matching the user's email
  function getCars() {
    if(props.userInfo === undefined) {
      return;
    }
    DB.getQuerey("userCreated", props.userInfo.email, "cars").onSnapshot(quereySnapshot => {
      var cars = [];
      for(var i = 0; i < quereySnapshot.docs.length; i++) {
        cars.push(quereySnapshot.docs[i].data());
      }
      setCars(cars);
    });
  }

  if(cars === undefined) {
    return (
      <Container fluid>
        <div style = {{textAlign: "center", marginTop: "3%"}}>
          <Spinner animation = "grow"/>
        </div>
      </Container>
    );
  }
  return (
    <Container fluid>
      <CarModal
        show = {showCarModal}
        setShow = {setShowCarModal}
        title = "Add Car"
        car = {CARMODEL.car}
        userInfo = {props.userInfo}
      />
      <Row style = {{marginTop: "2%"}}>
        <Col lg = {7}>
          <Row>
            <Col xs = {6}>
              <Button variant = "outline-dark" style = {{float: "left", marginRight: "3%"}}
                onClick = {() => {setShowCarModal(true)}}
              >
                +
              </Button>
              <h4 style = {{marginTop: "0.5%"}}> Your Cars </h4>
            </Col>
            {cars.length === 0 ?
              <div></div>
              :
              <Col xs = {6} style = {{textAlign: "right"}}>
                <Button variant = "light" style = {{marginRight: "1%"}}
                  onClick = {() => {setIsListView(true)}}
                >
                  <i class = "fa fa-bars"> </i> List
                </Button>
                <Button variant = "light"
                  onClick = {() => {setIsListView(false)}}
                >
                  <i class = "fa fa-th-large"> </i> Grid
                </Button>
              </Col>
            }
          </Row>
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
                      <ListGroup.Item action style = {{width: "100%"}}
                        onClick = {() => {
                          window.location.pathname = "/carInfo" + "/" + car.carId
                        }}
                      >
                        <Row>
                            {car.imageId.toString().trim().length === 0 ?
                              <Figure style = {{height: "50px", marginTop: "1%"}}>
                                <Figure.Image
                                  width = {100}
                                  height = {100}
                                  src = "car-holder.png"
                                />
                              </Figure>
                              :
                              <Figure style = {{height: "50px", marginTop: "1%"}}>
                                <Figure.Image
                                  width = {100}
                                  height = {100}
                                  src = {car.imageUrl}
                                />
                              </Figure>
                            }
                          <Col>
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
                    <a style = {{cursor: "pointer"}}
                      onClick = {() => {
                        window.location.pathname = "/carInfo" + "/" + car.carId
                      }}
                    >
                      <Card border = "dark">
                        {car.imageId.toString().trim().length === 0 ?
                          <Card.Img id = {car.carId} variant = "top" src = "car-holder.png"/>
                          :
                          <Card.Img id = {car.carId} variant = "top" src = {car.imageUrl}/>
                        }
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
                  {/*
                  <Button
                    variant = "outline-dark"
                    style = {{float: "right"}}
                    size = "sm"
                    disabled = {cars.length === 0}
                  >
                    +
                  </Button>
                  */}
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

export default Home;
