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
import Alert from 'react-bootstrap/Alert';
import Pie from 'react-chartjs-2';
import Card from 'react-bootstrap/Card';

import CarModal from '../components/CarModal.js';
import ScheduledLog from '../components/ScheduledLog.js';
import RepairLog from '../components/RepairLog.js';
import UpcomingMaintenance from '../components/UpcomingMaintenance.js';

const DB = require('../controllers/db.js');
const CARMODEL = require('../models/car.js');
const STORAGE = require('../controllers/storage.js');
const GENERICFUNCTIONS = require('../controllers/genericFunctions.js');

function CarInfo(props) {

  const[car, setCar] = useState();
  const[cars, setCars] = useState([]); //THIS IS ONLY USED TO PUSH THE CAR INTO AN ARRAY AND PASS IT AS PROPS TO UPCOMINGMAINTENANCE COMPONENT
  const[serviceLog, setServiceLog] = useState();
  const[ssts, setSsts] = useState();
  const[show, setShow] = useState(false);
  const[deleteShow, setDeleteShow] = useState(false);
  const[deleteCarShow, setDeleteCarShow] = useState(false);
  const[showEmpty, setShowEmpty] = useState(false);

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
        //alert("Internal error. Could not find car in database.");
        setShowEmpty(true);
      }
      else {
        setCar(quereySnapshot.docs[0].data());
        var cars = [];
        cars.push(quereySnapshot.docs[0].data());
        setCars(cars);
      }
    });
  }

  function getServiceLog(carId) {
    if(carId === undefined || carId === null) {
      return;
    }
    DB.getQuerey("carReferenceId", carId, "serviceLogs").onSnapshot(quereySnapshot => {
      if(quereySnapshot.docs.length > 1 || quereySnapshot.docs[0] === undefined) {
        //alert("Internal error. Could not find car's service log in database.");
        setShowEmpty(true);
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
          /*
          for(var i = 0; i < len; i++) {
            if(i < repairLen && repairLen !== 0) {
              serviceLog.repairLog[i].datePerformed = new Date(serviceLog.repairLog[i].datePerformed);
            }
            if(i < scheduledLen && scheduledLen !== 0) {
              serviceLog.scheduledLog[i].datePerformed = new Date(serviceLog.scheduledLog[i].datePerformed);
            }
          }
          */
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
        if(showEmpty || deleteCarShow) {
          return;
        }
        resetCarImageFields();
      },
      function(error) {
        alert(error);
        setDeleteShow(false);
        setDeleteCarShow(false);
      }
    );
  }

  function deleteServiceLog() {
    DB.deleteOne(serviceLog.logId, "serviceLogs",
      function() {
        return;
      },
      function(error) {
        alert(error);
      }
    );
  }

  //deletes car and all other objects associated with it
  function deleteCar() {
    DB.deleteOne(car.carId, "cars",
      function() {
        removeCarFromSsts();
        deleteServiceLog();
        if(car.imageId.length !== 0 && car.imageUrl.length !== 0) {
          deleteCarImage();
        }
        setDeleteCarShow(false);
        setShowEmpty(true);
      },
      function(error) {
        setDeleteCarShow(false);
        alert(error);
      }
    );
  }

  function removeCarFromSsts() {
    for(var i = 0; i < ssts.length; i++) {
      var sst = ssts[i];
      if(sst.carsScheduled[car.carId] !== undefined) {
        delete sst.carsScheduled[car.carId];
        DB.writeOne(sst.typeId, sst, "scheduledServiceTypes",
          function() {
            return;
          },
          function(error) {
            setDeleteCarShow(false);
            alert(error);
          }
        );
      }
    }
  }

  function calculateCostBreakdown() {
    var costs = [];
    var colors = ["red", "green", "blue", "orange"];
    //var colors = GENERICFUNCTIONS.randomColors(4);
    costs.push(Number(car.scheduledCost.partsCost));
    costs.push(Number(car.scheduledCost.laborCost));
    costs.push(Number(car.repairCost.partsCost));
    costs.push(Number(car.repairCost.laborCost));
    var data = {
      datasets: [{
        data: costs,
        backgroundColor: colors,
        hoverBackgroundColor: colors
      }],
      labels: ["Scheduled Parts Cost", "Scheduled Labor Cost", "Repair Parts Cost", "Repair Labor Cost"],
    };
    return data;
  }

  if(car === undefined || ssts === undefined || serviceLog === undefined || showEmpty) {
    if(showEmpty) {
      return (
        <Container>
          <br/>
          <Row>
            <Col style = {{textAlign: "center"}}>
              <h5> This car does not exist 😯 </h5>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col style = {{textAlign: "center"}}>
              <Button onClick = {() => {window.location.pathname = "/"}}>
                Return home
              </Button>
            </Col>
          </Row>
        </Container>
      );
    }
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
        title = "Edit Vehicle"
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
          <Modal.Title> Delete Vehicle Image </Modal.Title>
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
      <Modal
        show = {deleteCarShow}
        onHide = {() => {setDeleteCarShow(false)}}
        backdrop = "static"
        keyboard = {false}
      >
        <Modal.Header closeButton>
          <Modal.Title> Delete Vehicle </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant = "danger">
            <Alert.Heading>
              Warning
            </Alert.Heading>
            Are you sure you want to delete this vehicle? (all of this vehicle's data will be lost)
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick = {() => {deleteCar()}}
          >
            Yes
          </Button>
          <Button variant = "secondary"
            onClick = {() => {setDeleteCarShow(false)}}
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
                <Col lg = {6} style = {{marginBottom: "5%"}}>
                  <Row>
                    <Col>
                      <Row>
                        <Col style = {{textAlign: "right"}}>
                          <DropdownButton title = "⚙️" variant = "outline-dark">
                            <Dropdown.Item onClick = {() => {setShow(true)}}> Edit </Dropdown.Item>
                            <Dropdown.Item disabled = {car.imageUrl.trim().length === 0} onClick = {() => {setDeleteShow(true)}}> Delete Image </Dropdown.Item>
                            <Dropdown.Item onClick = {() => {setDeleteCarShow(true)}}> Delete Vehicle </Dropdown.Item>
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
                                  <div style = {{marginBottom: "1%"}}> {CARMODEL.publicFields[0].displayName} </div>
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
                                  <div style = {{marginBottom: "1%"}}> {CARMODEL.publicFields[1].displayName} </div>
                                  <Form.Control
                                    as = "input"
                                    size = "sm"
                                    readOnly
                                    style = {{backgroundColor: "#F4F6F6"}}
                                    value = {car[CARMODEL.publicFields[1].value]}
                                  />
                                </Col>
                              </Row>
                              <Row>
                                <Col sm = {4}>
                                  <div style = {{marginBottom: "1%"}}> {CARMODEL.publicFields[2].displayName} </div>
                                  <Form.Control
                                    as = "input"
                                    size = "sm"
                                    readOnly
                                    style = {{backgroundColor: "#F4F6F6"}}
                                    value = {car[CARMODEL.publicFields[2].value]}
                                  />
                                </Col>
                                <Col sm = {4}>
                                  <div style = {{marginBottom: "1%"}}> {CARMODEL.publicFields[3].displayName} </div>
                                  <Form.Control
                                    as = "input"
                                    size = "sm"
                                    readOnly
                                    style = {{backgroundColor: "#F4F6F6"}}
                                    value = {car[CARMODEL.publicFields[3].value]}
                                  />
                                </Col>
                                <Col sm = {4}>
                                  <div style = {{marginBottom: "1%"}}> {CARMODEL.publicFields[4].displayName} </div>
                                  <Form.Control
                                    as = "input"
                                    size = "sm"
                                    readOnly
                                    style = {{backgroundColor: "#F4F6F6"}}
                                    value = {car[CARMODEL.publicFields[4].value]}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                        {CARMODEL.publicFields.map((field, index) => {
                          if(index < 5) {
                            return (
                              <div></div>
                            );
                          }
                          return (
                            <Col md = {field.modalColSpan}>
                              <div style = {{marginBottom: "1%"}}> {field.displayName} </div>
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
                <Col lg = {6}>
                  <Row>
                    <Col>
                      <UpcomingMaintenance
                        cars = {cars}
                        userCreated = {props.userInfo.email}
                      />
                    </Col>
                  </Row>
                  <br style = {{height: "50%"}} />
                  <Row>
                    <Col>
                      <Card>
                        <Card.Header> Cost Breakdown 💰 </Card.Header>
                        <Card.Body>
                          <Card.Text>
                            <Pie
                              data = {calculateCostBreakdown()}
                              options = {{ maintainAspectRatio: false }}
                              height = {200}
                              width = {200}
                            />
                          </Card.Text>
                        </Card.Body>
                      </Card>
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
                car = {car}
                carId = {props.match.params.carId}
              />
            </Tab>
            <Tab eventKey = "repair-maintenance-log" title = "Repair Log">
              <br/>
              <RepairLog
                userInfo = {props.userInfo}
                serviceLog = {serviceLog}
                ssts = {ssts}
                car = {car}
                carId = {props.match.params.carId}
              />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}

export default CarInfo;
