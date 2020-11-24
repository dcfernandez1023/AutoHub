import React, { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal'

import AppNavbar from './AppNavbar.js';

const DB = require('../controllers/db.js');

function Home(props) {

  const[cars, setCars] = useState(); //user's Cars
  const[newCar, setNewCar] = useState({});
  const[showCarModal, setShowCarModal] = useState(false); //flag to display car modal

  useEffect(() => {
    getCars();
  }, [])

  //gets all of the user's cars from db & sets a listener on the car collection with documents matching the user's email
  function getCars() {
    if(props.userEmail === undefined) {
      return;
    }
    DB.getQuerey("userCreated", props.userEmail, "cars").onSnapshot(quereySnapshot => {
      var cars = [];
      for(var i = 0; i < quereySnapshot.docs.length; i++) {
        cars.push(quereySnapshot.docs[i].data());
      }
      setCars(cars);
    });
  }

  //function to handle car modal closing
  function handleCarModalClose() {
    setNewCar({});
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
          hello
        </Modal.Body>
      </Modal>
      <AppNavbar/>
      <Row style = {{marginLeft: "1%", marginTop: "1.5%"}}>
        <Col lg = {8}>
          <Row>
            <Col>
              <Button size = "lg" variant = "outline-dark" style = {{float: "left", marginRight: "0.5%"}}
                onClick = {() => {setShowCarModal(true)}}
              >
                +
              </Button>
              <h4 style = {{marginTop: "0.5%"}}> Your Cars </h4>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col>
              <Button variant = "light" style = {{marginRight: "1%"}}> Gallery </Button>
              <Button variant = "light"> List </Button>
            </Col>
          </Row>
          <Row>

          </Row>
        </Col>
        <Col lg = {4}>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
