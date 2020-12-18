import React, { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

import SSTModal from '../components/SSTModal.js';

const SSTModel = require('../models/scheduledServiceType.js');

const DB = require('../controllers/db.js');

function ScheduledServiceTypes(props) {

  const[ssts, setSsts] = useState();
  const[addShow, setAddShow] = useState(false);
  const[editShow, setEditShow] = useState(false);
  const[deleteShow, setDeleteShow] = useState(false);
  const[sstToEdit, setSstToEdit] = useState();
  const[sstToDelete, setSstToDelete] = useState();
  const[cars, setCars] = useState();
  const[carLookup, setCarLookup] = useState();

  useEffect(() => {
    getCars();
    getSsts();
  }, [props.userInfo])

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
      initializeCarLookup(cars);
    });
  }

  function initializeCarLookup(cars) {
    var lookup = {};
    for(var i = 0; i < cars.length; i++) {
      var car = cars[i];
      lookup[car.carId] = car.name;
    }
    setCarLookup(lookup);
  }

  function getSsts() {
    if(props.userInfo === undefined) {
      return;
    }
    DB.getQuerey("userCreated", props.userInfo.email, "scheduledServiceTypes").onSnapshot(quereySnapshot => {
      var ssts = [];
      for(var i = 0; i < quereySnapshot.docs.length; i++) {
        ssts.push(quereySnapshot.docs[i].data());
      }
      setSsts(ssts);
    });
  }

  if(props.userInfo === undefined || ssts === undefined) {
    return (
      <Container fluid>
        <div style = {{textAlign: "center", marginTop: "3%"}}>
          <Spinner animation = "grow"/>
        </div>
      </Container>
    );
  }

  function deleteSst() {
    if(sstToDelete !== undefined) {
      DB.deleteOne(sstToDelete.typeId, "scheduledServiceTypes",
        function() {
          handleDeleteModalClose();
        },
        function(error) {
          alert(error);
        }
      )
    }
    else {
      alert("Internal error. Could not delete scheduled service type");
    }
  }

  function handleDeleteModalClose() {
    setDeleteShow(false);
    setSstToDelete();
  }

  return (
    <Container>
      <SSTModal
        userCreated = {props.userInfo.email}
        cars = {cars}
        show = {addShow ? addShow : editShow ? editShow : false}
        sst = {addShow ? SSTModel.scheduledServiceType : editShow ? sstToEdit : undefined}
        setShow = {addShow ? setAddShow : editShow ? setEditShow : function() {setAddShow(false); setEditShow(false)}}
        title = {addShow ? "Add Scheduled Service Type" : editShow ? "Edit Scheduled Service Type" : ""}
      />
      <Modal
        show = {deleteShow}
        onHide = {handleDeleteModalClose}
        backdrop = "static"
        keyboard = {false}
      >
        <Modal.Header closeButton>
          <Modal.Title> Delete Scheduled Service Type </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{sstToDelete !== undefined ? "'" + sstToDelete.serviceName + "'" : ""}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick = {() => {deleteSst()}}
          >
            Yes
          </Button>
          <Button variant = "secondary"
            onClick = {() => {handleDeleteModalClose()}}
          >
            No
          </Button>
        </Modal.Footer>
      </Modal>
      <br/>
      <Row>
        <Col>
          <h4 style = {{marginTop: "1%"}}>
            <Button variant = "outline-dark" style = {{marginRight: "1%"}}
                onClick = {() => {
                  setAddShow(true);
                }}
              >
                +
            </Button>
            Scheduled Service Types
          </h4>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col>
        {ssts.length === 0 ?
          <h6> You do not have any scheduled service types. 🛎️ </h6>
          :
          <Accordion>
          {ssts.map((service) => {
            return (
              <Card>
                <Card.Header>
                  <Accordion.Toggle as = {Button} variant = "light" eventKey = {service.typeId}>
                    {service.serviceName}
                  </Accordion.Toggle>
                  <Button size = "sm" variant = "outline-dark" style = {{float: "right"}}
                    onClick = {() => {
                      setDeleteShow(true);
                      setSstToDelete(service);
                    }}
                  >
                    🗑️
                  </Button>
                  <Button size = "sm" variant = "outline-dark" style = {{float: "right", marginRight: "1%"}}
                    onClick = {() => {
                      setEditShow(true);
                      setSstToEdit(service);
                    }}
                  >
                    ✏️
                  </Button>
                </Card.Header>
                <Accordion.Collapse eventKey = {service.typeId}>
                  <Card.Body>
                    {Object.keys(service.carsScheduled).map((key) => {
                      var mileValue;
                      var timeValue;
                      if(Number(service.carsScheduled[key].miles) > 0) {
                        mileValue = "Every " + service.carsScheduled[key].miles;
                      }
                      else {
                        mileValue = "None";
                      }
                      if(Number(service.carsScheduled[key].time.quantity) > 1) {
                        timeValue = "Every " + service.carsScheduled[key].time.quantity + " " + service.carsScheduled[key].time.units + "s";
                      }
                      else if(Number(service.carsScheduled[key].time.quantity) === 1) {
                        timeValue = "Every " + service.carsScheduled[key].time.quantity + " " + service.carsScheduled[key].time.units;
                      }
                      else {
                        timeValue = "None"
                      }
                      return (
                        <Row>
                          <Col>
                            <Row>
                              <Col>
                                <Row style = {{marginBottom: "1%"}}>
                                  <Col md = {3}>
                                    <h5> {carLookup[key]} </h5>
                                  </Col>
                                  <Col md = {4} style = {{marginBottom: "1%"}}>
                                    <Form.Label> 💨 Mile Interval </Form.Label>
                                    <Form.Control
                                      size = "sm"
                                      as = "input"
                                      value = {mileValue}
                                      readOnly
                                    />
                                  </Col>
                                  <Col md = {5}>
                                    <Form.Label> 🕒 Time Interval </Form.Label>
                                      <Form.Control
                                        size = "sm"
                                        value = {timeValue}
                                        as = "input"
                                        readOnly
                                      />
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <hr style = {{border: "1px solid lightGray"}} />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      );
                    })}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            );
          })}
          </Accordion>
        }
        </Col>
      </Row>
    </Container>
  );
}

export default ScheduledServiceTypes;
