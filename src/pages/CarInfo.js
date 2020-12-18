import React, { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Spinner from 'react-bootstrap/Spinner';
import Image from 'react-bootstrap/Image';

import CarModal from '../components/CarModal.js';

const DB = require('../controllers/db.js');
const CARMODEL = require('../models/car.js');

function CarInfo(props) {

  const[car, setCar] = useState();
  const[show, setShow] = useState(false);

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
      <CarModal
        show = {show}
        setShow = {setShow}
        title = "Edit Car"
        car = {car}
        userInfo = {props.userInfo}
      />
      <br/>
      <Row>
        <Col>
          <Tabs defaultActiveKey = "info" id = {car.carId}>
            <Tab eventKey = "info" title = "Info">
              <br/>
              <Row style = {{marginLeft: "2%"}}>
                <Col md = {6}>
                  <Row>
                    <Col>
                      <Row>
                        <Col style = {{textAlign: "right"}}>
                          <Button variant = "outline-dark"
                            size = "sm"
                            onClick = {() => {setShow(true)}}
                          >
                            ✏️
                          </Button>
                        </Col>
                      </Row>
                      <Row>
                        <Col md = {12}>
                          <Row>
                            <Col xl = {4} style = {{marginBottom: "3%"}}>
                              {car.imageUrl.trim().length === 0 ?
                                <Image src = "car-holder.png" style = {{width: "175px", height: "175px"}} />
                                :
                                <Image src = {car.imageUrl} style = {{width: "175px", height: "175px"}} />
                              }
                            </Col>
                            <Col xl = {8}>
                              <Row>
                                <Col md = {12}>
                                  <Form.Label> {CARMODEL.publicFields[0].displayName} </Form.Label>
                                  <Form.Control
                                    as = "input"
                                    readOnly
                                    value = {car[CARMODEL.publicFields[0].value]}
                                  />
                                </Col>
                              </Row>
                              <Row>
                                <Col md = {12}>
                                  <Form.Label> {CARMODEL.publicFields[1].displayName} </Form.Label>
                                  <Form.Control
                                    as = "input"
                                    readOnly
                                    value = {car[CARMODEL.publicFields[1].value]}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                        {CARMODEL.publicFields.map((field, index) => {
                          if(index < 2) {
                            return (
                              <div></div>
                            );
                          }
                          return (
                            <Col md = {field.modalColSpan}>
                              <Form.Label> {field.displayName} </Form.Label>
                              <Form.Control
                                as = {field.inputType === "select" ? "input" : field.inputType}
                                readOnly
                                value = {car[field.value]}
                              />
                            </Col>
                          );
                        })}
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
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
