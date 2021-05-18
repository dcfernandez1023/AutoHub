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
import Image from 'react-bootstrap/Image';
import { v4 as uuidv4 } from 'uuid';

import CarModal from './CarModal.js';
import UpcomingMaintenance from './UpcomingMaintenance.js';

const DB = require('../controllers/db.js');
const STORAGE = require('../controllers/storage.js');
const CARMODEL = require('../models/car.js');
const GENERICFUNCTIONS = require('../controllers/genericFunctions.js');

function Home(props) {

  const[showCarModal, setShowCarModal] = useState(false); //flag to display car modal
  const[cars, setCars] = useState(); //user's Cars
  const[isListView, setIsListView] = useState(true); //flag to toggle the mode of displaying cars (list vs. grid)

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
        title = "Add Vehicle"
        car = {CARMODEL.car}
        userInfo = {props.userInfo}
      />
    <Row style = {{marginTop: "25px"}}>
        <Col lg = {7}>
          <Row>
            <Col xs = {6}>
              <Button variant = "outline-dark" style = {{float: "left", marginRight: "3%"}}
                onClick = {() => {setShowCarModal(true)}}
              >
                +
              </Button>
              <h4 style = {{marginTop: "0.5%"}}> Your Vehicles </h4>
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
              <h6> You have not added any vehicles. Click the + button to add a vehicle 🚗 </h6>
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
                          <Col xs = {8}>
                            <Row>
                              <Col>
                                <p> <b> {car.name} </b> </p>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <p> <small> {car.year + " " + " " + car.make + " " + car.model} </small> </p>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <p> <Badge pills variant = "light"> {car.mileage + " miles"} </Badge> </p>
                              </Col>
                            </Row>
                          </Col>
                          <Col xs = {4} style = {{textAlign: "right"}}>
                            {car.imageId.toString().trim().length === 0 ?
                              <Image src = "car-holder.png" style = {{width: "80px", height: "75px"}} />
                              :
                              <Image src = {car.imageUrl} style = {{width: "80px", height: "75px"}} />
                            }
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                );
              }
              else {
                return (
                  <Col xl = {3} lg = {4} sm = {3} xs = {6} style = {{marginBottom: "5%"}}>
                    <a style = {{cursor: "pointer"}}
                      onClick = {() => {
                        window.location.pathname = "/carInfo" + "/" + car.carId
                      }}
                    >
                      <Card border = "dark">
                        {car.imageId.toString().trim().length === 0 ?
                          <Card.Img style = {{height: "140px"}} id = {car.carId} variant = "top" src = "car-holder.png" />
                          :
                          <Card.Img style = {{height: "140px"}} id = {car.carId} variant = "top" src = {car.imageUrl}/>
                        }
                        <Card.Body>
                          <Row>
                            <Col>
                              <p> <strong> {car.name} </strong> </p>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <p> <small> {car.year + " " + " " + car.make + " " + car.model} </small> </p>
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
          <UpcomingMaintenance
            cars = {cars}
            userCreated = {props.userInfo.email}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
