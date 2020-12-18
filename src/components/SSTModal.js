import React, { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';

const SSTModel = require('../models/scheduledServiceType.js');
const GENERICFUNCTIONS = require('../controllers/genericFunctions.js');
const DB = require('../controllers/db.js');

function SSTModal(props) {

  const[cars, setCars] = useState();
  const[sst, setSst] = useState();
  const[show, setShow] = useState(false);
  const[title, setTitle] = useState("");
  const[validated, setValidated] = useState(false);
  const[toggleApply, setToggleApply] = useState(false);
  const[selectedCars, setSelectedCars] = useState({});
  const[globalInterval, setGlobalInterval] = useState()

  useEffect(() => {
    setShow(props.show);
    setTitle(props.title);
    setGlobalInterval(SSTModel.interval);
    initialize(props.sst, props.cars);
  }, [props.sst, props.show, props.title, props.userInfo, props.cars])

  function initialize(initSst, initCars) {
    if(initSst === undefined || initCars === undefined) {
      return;
    }
    var len = Object.keys(initSst.carsScheduled).length;
    var selected = {};
    for(var i = 0; i < initCars.length; i++) {
      var car = initCars[i];
      selected[car.carId] = false;
      if(initSst.carsScheduled[car.carId] === undefined) {
        initSst.carsScheduled[car.carId] = SSTModel.interval;
      }
    }
    setSelectedCars(selected);
    setSst(initSst);
    setCars(initCars);
  }

  function handleModalClose() {
    props.setShow(false);
    setToggleApply(false);
    setValidated(false);
    setSst();
    setTitle("");
  }

  function onChangeInterval(e, id, option) {
    var name = [e.target.name][0];
    var value = e.target.value;
    var copy = JSON.parse(JSON.stringify(sst));
    if(name === "time") {
      if(option === "quantity" && isNaN(value)) {
        return;
      }
      copy.carsScheduled[id].time[option] = value;
    }
    else {
      if(isNaN(value)) {
        return;
      }
      copy.carsScheduled[id].miles = value;
    }
    setSst(copy);
    setValidated(false);
  }

  function onChangeGlobalInterval(e, option) {
    var name = [e.target.name][0];
    var value = e.target.value;
    var copy = JSON.parse(JSON.stringify(globalInterval));
    if(name === "time") {
      if(option === "quantity" && isNaN(value)) {
        return;
      }
      copy.time[option] = value;
    }
    else {
      if(isNaN(value)) {
        return;
      }
      copy.miles = value;
    }
    setGlobalInterval(copy);
  }

  function getNumSelected() {
    var count = 0;
    for(var key in selectedCars) {
      if(selectedCars[key] === true) {
        count++;
      }
    }
    return count;
  }

  function selectAll() {
    var len = Object.keys(selectedCars).length;
    var selected = {};
    for(var i = 0; i < cars.length; i++) {
      var car = cars[i];
      selected[car.carId] = true;
    }
    setSelectedCars(selected);
  }

  function unselectAll() {
    var len = Object.keys(selectedCars).length;
    var selected = {};
    for(var i = 0; i < cars.length; i++) {
      var car = cars[i];
      selected[car.carId] = false;
    }
    setSelectedCars(selected);
  }

  function selectCar(id) {
    var copy = JSON.parse(JSON.stringify(selectedCars));
    copy[id] = !copy[id];
    setSelectedCars(copy);
  }

  function applyGlobalInterval() {
    var copy = JSON.parse(JSON.stringify(sst));
    for(var key in copy.carsScheduled) {
      if(selectedCars[key]) {
        copy.carsScheduled[key] = globalInterval;
      }
    }
    setSst(copy);
  }

  function onSubmit(e) {
    setValidated(true);
    var isValid = checkSubmitFields();
    if(isValid) {
      if(props.userCreated !== undefined) {
        sst.userCreated = props.userCreated;
        if(sst.typeId.trim().length === 0) {
          sst.typeId = GENERICFUNCTIONS.generateId();
        }
        saveSst();
      }
      else {
        alert("Internal error. Could not add scheduled service type");
      }
    }
  }

  function saveSst() {
    massageSst();
    DB.writeOne(sst.typeId, sst, "scheduledServiceTypes",
      function() {
        handleModalClose();
      },
      function(error) {
        alert(error);
      }
    );
  }

  function massageSst() {
    for(var key in sst.carsScheduled) {
      var entry = sst.carsScheduled[key];
      if(entry.miles === 0 && entry.time.quantity === 0 && entry.time.units === "none") {
        delete sst.carsScheduled[key];
      }
    }
  }

  function checkSubmitFields() {
    var isValid = true;
    if(sst.serviceName.trim().length === 0) {
      sst.serviceName = "";
      isValid = false;
    }
    for(var key in sst.carsScheduled) {
      var entry = sst.carsScheduled[key];
      if(entry.miles.toString().trim().length === 0) {
        sst.carsScheduled[key].miles = 0;
      }
      if(entry.time.quantity.toString().trim().length === 0) {
        sst.carsScheduled[key].time.quantity = 0;
      }
      if(Number(entry.time.quantity.toString().trim()) > 0 && entry.time.units.trim() === "none") {
        isValid = false;
      }
      if(entry.time.units.length !== 0 && entry.time.units !== "none" && entry.time.quantity === 0) {
        isValid = false;
      }
    }
    return isValid;
  }

  if(sst === undefined || cars === undefined || sst.carsScheduled === undefined) {
    return <div></div>;
  }

  return (
    <Modal
      show = {show}
      onHide = {handleModalClose}
      backdrop = "static"
      keyboard = {false}
    >
      <Modal.Header closeButton>
        <Modal.Title> {title} </Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <Row>
            <Col>
              <Form.Label> Service Name </Form.Label>
              <Form.Control
                isInvalid = {validated ? sst.serviceName.trim().length === 0 : undefined}
                size = "sm"
                as = "input"
                name = "serviceName"
                value = {sst.serviceName}
                onChange = {(e) => {
                  var copy = JSON.parse(JSON.stringify(sst));
                  var name = [e.target.name][0];
                  var value = e.target.value;
                  copy[name] = value;
                  setSst(copy);
                  setValidated(false);
                }}
              />
              <Form.Control.Feedback type = "invalid">
                Required
              </Form.Control.Feedback>
            </Col>
          </Row>
          <hr style = {{border: "1px solid lightGray"}} />
          <Row>
            <Col xs = {9}>
              <h5> Cars </h5>
            </Col>
            <Col xs = {3} style = {{textAlign: "right"}}>
              {!toggleApply ?
                <Button variant = "outline-dark" size = "sm"
                  onClick = {() => {
                    setToggleApply(true);
                  }}
                >
                  ✏️
                </Button>
                :
                <Button variant = "outline-dark" size = "sm"
                  onClick = {() => {
                    setToggleApply(false);
                  }}
                >
                  ✔️
                </Button>
              }
            </Col>
          </Row>
          <br/>
          {!toggleApply ?
            <div>
              {cars.map((car) => {
                return (
                  <Row>
                    <Col>
                      <ListGroup horizontal>
                        <ListGroup.Item style = {{width: "100%"}}>
                          <Row style = {{marginBottom: "3%"}}>
                            <Col>
                              <p> <strong> {car.name} </strong> </p>
                            </Col>
                          </Row>
                          <Row>
                            <Col sm = {5} style = {{marginBottom: "3%"}}>
                              <Form.Label> 💨 Mile Interval </Form.Label>
                              <Form.Control
                                size = "sm"
                                as = "input"
                                name = "miles"
                                value = {sst.carsScheduled[car.carId] !== undefined ?
                                          sst.carsScheduled[car.carId].miles
                                          :
                                          SSTModel.interval.miles
                                        }
                                onChange = {(e) => {
                                  onChangeInterval(e, car.carId);
                                }}
                              />
                            </Col>
                            <Col sm = {7}>
                              <Form.Label> 🕒 Time Interval </Form.Label>
                              <InputGroup size = "sm">
                                <Form.Control
                                  as = "input"
                                  name = "time"
                                  value = {sst.carsScheduled[car.carId] !== undefined ?
                                            sst.carsScheduled[car.carId].time.quantity
                                            :
                                            SSTModel.interval.time.quantity
                                          }
                                  isInvalid = {validated && sst.carsScheduled[car.carId] !== undefined ? sst.carsScheduled[car.carId].time.units.length !== 0 && sst.carsScheduled[car.carId].time.units !== "none" && sst.carsScheduled[car.carId].time.quantity === 0 : undefined}
                                  onChange = {(e) => {
                                    onChangeInterval(e, car.carId, "quantity");
                                  }}
                                  style = {{marginRight: "2%"}}
                                />
                                <Form.Control
                                  as = "select"
                                  name = "time"
                                  value = {sst.carsScheduled[car.carId] !== undefined ?
                                            sst.carsScheduled[car.carId].time.units
                                            :
                                            SSTModel.interval.time.units
                                          }
                                  isInvalid = {validated&&  sst.carsScheduled[car.carId] !== undefined ? Number(sst.carsScheduled[car.carId].time.quantity.toString().trim()) > 0 && sst.carsScheduled[car.carId].time.units === "none"
                                              :
                                              undefined
                                              }
                                  onChange = {(e) => {
                                    onChangeInterval(e, car.carId, "units");
                                  }}
                                >
                                  <option value = "none" selected> Select </option>
                                  {SSTModel.timeUnits.map((unit) => {
                                    return (
                                      <option value = {unit.value}> {unit.displayName} </option>
                                    );
                                  })}
                                </Form.Control>
                              </InputGroup>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      </ListGroup>
                    </Col>
                  </Row>
                );
              })}
            </div>
            :
            <div>
              <Row style = {{marginBottom: "3%"}}>
                <Col>
                  <InputGroup size = "sm">
                    <div style = {{marginRight: "1%"}}>
                      Every
                    </div>
                    <div style = {{width: "15%", marginRight: "1%"}}>
                      <Form.Control
                        size = "sm"
                        as = "input"
                        name = "miles"
                        value = {globalInterval !== undefined ?
                                  globalInterval.miles
                                  :
                                  SSTModel.interval.miles
                                }
                        onChange = {(e) => {
                          onChangeGlobalInterval(e);
                        }}
                      />
                    </div>
                    <div style = {{marginRight: "1%"}}>
                      miles or
                    </div>
                    <div style = {{width: "12%", marginRight: "1%"}}>
                      <Form.Control
                        size = "sm"
                        as = "input"
                        name = "time"
                        value = {globalInterval !== undefined ?
                                  globalInterval.time.quantity
                                  :
                                  SSTModel.interval.time.quantity
                                }
                        onChange = {(e) => {
                          onChangeGlobalInterval(e, "quantity");
                        }}
                      />
                    </div>
                    <Form.Control
                      as = "select"
                      name = "time"
                      value = {globalInterval !== undefined ?
                                globalInterval.time.units
                                :
                                SSTModel.interval.time.units
                              }
                      onChange = {(e) => {
                        onChangeGlobalInterval(e, "units");
                      }}
                    >
                      <option value = "" selected> Select </option>
                      {SSTModel.timeUnits.map((unit) => {
                        return (
                          <option value = {unit.value}> {unit.displayName} </option>
                        );
                      })}
                    </Form.Control>
                  </InputGroup>
                </Col>
              </Row>
              <Row style = {{marginBottom: "3%"}}>
                <Col style = {{textAlign: "right"}}>
                  <Button size = "sm" variant = "success" style = {{marginRight: "2%"}}
                    onClick = {() => {applyGlobalInterval()}}
                  >
                    Apply
                  </Button>
                  <OverlayTrigger
                    key = "apply-info"
                    placement = "bottom"
                    overlay = {
                      <Tooltip id = "apply-info-tooltip">
                        Enter the desired <strong> mile </strong> and/or <strong> time </strong> interval and click the 'Apply' button
                        to apply it to the selected cars.
                      </Tooltip>
                    }
                  >
                    <Button size = "sm" variant = "light">
                      🛈
                    </Button>
                  </OverlayTrigger>
                </Col>
              </Row>
              <hr style = {{border: "1px solid lightGray"}} />
              <Row style = {{marginBottom: "2%"}}>
                <Col>
                  {getNumSelected() !== 0 ?
                    <Button variant = "secondary" size = "sm"
                      onClick = {() => {unselectAll()}}
                    >
                      Unselect All
                    </Button>
                    :
                    <Button variant = "secondary" size = "sm"
                      onClick = {() => {selectAll()}}
                    >
                      Select All
                    </Button>
                  }
                </Col>
              </Row>
              {cars.map((car, index) => {
                return (
                  <Row>
                    <Col>
                      <ListGroup horizontal>
                        <ListGroup.Item>
                          <Row style = {{marginBottom: "3%"}}>
                            <Col>
                              <Form.Check
                                type = "checkbox"
                                checked = {selectedCars[car.carId]}
                                id = {car.carId + index}
                                label = {<p> <strong> {car.name} </strong> </p>}
                                onChange = {() => {selectCar(car.carId)}}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col sm = {5} style = {{marginBottom: "3%"}}>
                              <Form.Label> 💨 Mile Interval </Form.Label>
                              <Form.Control
                                size = "sm"
                                as = "input"
                                name = "miles"
                                value = {sst.carsScheduled[car.carId] !== undefined ?
                                          sst.carsScheduled[car.carId].miles
                                          :
                                          SSTModel.interval.miles
                                        }
                                onChange = {(e) => {
                                  onChangeInterval(e, car.carId);
                                }}
                              />
                            </Col>
                            <Col sm = {7}>
                              <Form.Label> 🕒 Time Interval </Form.Label>
                              <InputGroup size = "sm">
                                <Form.Control
                                  as = "input"
                                  name = "time"
                                  value = {sst.carsScheduled[car.carId] !== undefined ?
                                            sst.carsScheduled[car.carId].time.quantity
                                            :
                                            SSTModel.interval.time.quantity
                                          }
                                  onChange = {(e) => {
                                    onChangeInterval(e, car.carId, "quantity");
                                  }}
                                  style = {{marginRight: "2%"}}
                                />
                                <Form.Control
                                  as = "select"
                                  name = "time"
                                  value = {sst.carsScheduled[car.carId] !== undefined ?
                                            sst.carsScheduled[car.carId].time.units
                                            :
                                            SSTModel.interval.time.units
                                          }
                                  onChange = {(e) => {
                                    onChangeInterval(e, car.carId, "units");
                                  }}
                                >
                                  <option value = "none" selected> Select </option>
                                  {SSTModel.timeUnits.map((unit) => {
                                    return (
                                      <option value = {unit.value}> {unit.displayName} </option>
                                    );
                                  })}
                                </Form.Control>
                              </InputGroup>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      </ListGroup>
                    </Col>
                  </Row>
                );
              })}
            </div>
          }
      </Modal.Body>
      {!toggleApply ?
        <Modal.Footer>
          <Button onClick = {() => {onSubmit()}}>
            Save
          </Button>
        </Modal.Footer>
        :
        <div></div>
      }
    </Modal>
  );
}

export default SSTModal;