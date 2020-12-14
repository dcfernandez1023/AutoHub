import React, { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Spinner from 'react-bootstrap/Spinner';

const DB = require('../controllers/db.js');
const CARMODEL = require('../models/car.js');

function CarInfo(props) {

  const[car, setCar] = useState();

  useEffect(() => {
    getCar(props.match.params.carId);
  }, [props.match.params.carId])

  function getCar(carId) {
    if(carId === undefined || carId === null) {
      return;
    }
    DB.getQuerey("carId", carId, "cars").onSnapshot(quereySnapshot => {
      if(quereySnapshot.docs.length > 1) {
        alert("Internal error. Could not find car in database.");
      }
      else {
        setCar(quereySnapshot.docs[0].data());
      }
    });
  }

  if(car === undefined) {
    return (
      <Container>
        <div style = {{textAlign: "center", marginTop: "3%"}}>
          <Spinner animation = "grow"/>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <br/>
      <Row>
        <Col>
          <Tabs defaultActiveKey = "info" id = {car.carId}>
            <Tab eventKey = "info" title = "Info">
            </Tab>
            <Tab eventKey = "scheduled-maintenance-log" title = "Scheduled Log">
            </Tab>
            <Tab eventKey = "repair-maintenance-log" title = "Repair Log">
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}

export default CarInfo;
