import React, { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Image from 'react-bootstrap/Image';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

import CarModal from '../components/CarModal.js';
import ScheduledLog from '../components/ScheduledLog.js';
import RepairLog from '../components/RepairLog.js';

const DB = require('../controllers/db.js');
const CARMODEL = require('../models/car.js');
const STORAGE = require('../controllers/storage.js');

function CarInfo(props) {

  const[car, setCar] = useState();
  const[serviceLog, setServiceLog] = useState();
  const[ssts, setSsts] = useState();
  const[show, setShow] = useState(false);
  const[deleteShow, setDeleteShow] = useState(false);

  useEffect(() => {
    getCar(props.match.params.carId);
    getSsts();
    getServiceLog(props.match.params.carId);
  }, [props.match.params.carId, props.userInfo])

  function getCar(carId) {
    if(carId === undefined || carId === null) {
      return;
    }
    DB.getQuerey("carId", carId, "cars").onSnapshot(quereySnapshot => {
      if(quereySnapshot.docs.length > 1 || quereySnapshot.docs[0] === undefined) {
        alert("Internal error. Could not find car in database.");
      }
      else {
        setCar(quereySnapshot.docs[0].data());
      }
    });
  }

  function getServiceLog(carId) {
    if(carId === undefined || carId === null) {
      return;
    }
    DB.getQuerey("carReferenceId", carId, "serviceLogs").onSnapshot(quereySnapshot => {
      if(quereySnapshot.docs.length > 1 || quereySnapshot.docs[0] === undefined) {
        alert("Internal error. Could not find car's service log in database.");
      }
      else {
        var serviceLog = quereySnapshot.docs[0].data();
        if(serviceLog !== undefined) {
          var len;
          var repairLen = serviceLog.repairLog.length;
          var scheduledLen = serviceLog.scheduledLog.length;
          if(repairLen > scheduledLen) {
            len = serviceLog.repairLog.length;
          }
          else {
            len = serviceLog.scheduledLog.length;
          }
          for(var i = 0; i < len; i++) {
            if(i < repairLen && repairLen !== 0) {
              serviceLog.repairLog[i].datePerformed = new Date(serviceLog.repairLog[i].datePerformed);
            }
            if(i < scheduledLen && scheduledLen !== 0) {
              serviceLog.scheduledLog[i].datePerformed = new Date(serviceLog.scheduledLog[i].datePerformed);
            }
          }
        }
        setServiceLog(serviceLog);
      }
    });
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

  function resetCarImageFields() {
    var copy = JSON.parse(JSON.stringify(car));
    copy.imageId = "";
    copy.imageUrl = "";
    DB.writeOne(copy.carId, copy, "cars",
      function(data) {
        setCar(data);
        setDeleteShow(false);
      },
      function(error) {
        alert(error);
        setDeleteShow(false);
      }
    );
  }

  function deleteCarImage() {
    if(car === undefined) {
      alert("Internal error. Could not delete car image");
      return;
    }
    STORAGE.deleteFile(car.imageUrl,
      function() {
        setDeleteShow(false);
        resetCarImageFields();
      },
      function(error) {
        alert(error);
        setDeleteShow(false);
      }
    );
  }

  if(car === undefined || ssts === undefined || serviceLog === undefined) {
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
      <Modal
        show = {deleteShow}
        onHide = {() => {setDeleteShow(false)}}
        backdrop = "static"
        keyboard = {false}
      >
        <Modal.Header closeButton>
          <Modal.Title> Delete Car Image </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col lg = {6} style = {{marginBottom: "5%"}}>
              Are you sure you want to delete this image?
            </Col>
            <Col lg = {6} style = {{textAlign: "center"}}>
              <Image src = {car.imageUrl} style = {{width: "175px", height: "175px"}} />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick = {() => {deleteCarImage()}}
          >
            Yes
          </Button>
          <Button variant = "secondary"
            onClick = {() => {setDeleteShow(false)}}
          >
            No
          </Button>
        </Modal.Footer>
      </Modal>
      <br/>
      <Row>
        <Col>
          <Tabs defaultActiveKey = "info" id = {car.carId}>
            <Tab eventKey = "info" title = "Info">
              <br/>
              <Row>
                <Col md = {6}>
                  <Row>
                    <Col>
                      <Row>
                        <Col style = {{textAlign: "right"}}>
                          <DropdownButton variant = "outline-dark">
                            <Dropdown.Item onClick = {() => {setShow(true)}}> Edit </Dropdown.Item>
                            <Dropdown.Item disabled = {car.imageUrl.trim().length === 0} onClick = {() => {setDeleteShow(true)}}> Delete Image </Dropdown.Item>
                          </DropdownButton>
                        </Col>
                      </Row>
                      <Row>
                        <Col md = {12}>
                          <Row>
                            <Col xl = {4} style = {{marginBottom: "2%", textAlign: "center"}}>
                              {car.imageUrl.trim().length === 0 ?
                                <Image src = "/noImage.png" style = {{width: "175px", height: "175px"}} />
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
                                    size = "sm"
                                    readOnly
                                    style = {{backgroundColor: "#F4F6F6"}}
                                    value = {car[CARMODEL.publicFields[0].value]}
                                  />
                                </Col>
                              </Row>
                              <Row>
                                <Col md = {12}>
                                  <Form.Label> {CARMODEL.publicFields[1].displayName} </Form.Label>
                                  <Form.Control
                                    as = "input"
                                    size = "sm"
                                    readOnly
                                    style = {{backgroundColor: "#F4F6F6"}}
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
                                size = "sm"
                                readOnly
                                style = {{backgroundColor: "#F4F6F6"}}
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
              <br/>
              <ScheduledLog
                userInfo = {props.userInfo}
                serviceLog = {serviceLog}
                ssts = {ssts}
              />
            </Tab>
            <Tab eventKey = "repair-maintenance-log" title = "Repair Log">
              <br/>
              <RepairLog
                userInfo = {props.userInfo}
                serviceLog = {serviceLog}
                ssts = {ssts}
              />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}

export default CarInfo;
