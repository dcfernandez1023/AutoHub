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

function SSTModal(props) {

  const[cars, setCars] = useState();
  const[sst, setSst] = useState();
  const[show, setShow] = useState(false);
  const[title, setTitle] = useState("");
  const[validated, setValidated] = useState(false);
  const[toggleApply, setToggleApply] = useState(false);

  useEffect(() => {
    setShow(props.show);
    setTitle(props.title);
    initializeSstFields(props.sst, props.cars);
  }, [props.sst, props.show, props.title, props.userInfo, props.cars])

  function initializeSstFields(initSst, initCars) {
    if(initSst === undefined || initCars === undefined) {
      return;
    }
    var len = Object.keys(initSst.carsScheduled).length;
    if(len === 0) {
      for(var i = 0; i < initCars.length; i++) {
        var car = initCars[i];
        initSst.carsScheduled[car.carId] = {date: "", miles: 0};
      }
    }
    console.log(initSst);
    setSst(initSst);
    setCars(initCars);
  }

  function handleModalClose() {
    props.setShow(false);
    setSst();
    setTitle("");
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
        <Form noValidate validated = {validated} onSubmit = {props.handleSubmit}>
          <Row>
            <Col>
              <Form.Label> Service Name </Form.Label>
              <Form.Control
                required = {true}
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
                                name = "date"
                                value = {sst.carsScheduled[car.carId].date}
                              />
                            </Col>
                            <Col sm = {7}>
                              <Form.Label> 🕒 Time Interval </Form.Label>
                              <InputGroup size = "sm">
                                <Form.Control
                                  as = "input"
                                  style = {{marginRight: "2%"}}
                                />
                                <Form.Control
                                  as = "select"
                                >
                                  <option> Day(s) </option>
                                  <option> Week(s) </option>
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
              <Row>
                <Col sm = {10}>
                  <InputGroup size = "sm">
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
                      <Button size = "sm" variant = "light" style = {{marginRight: "2%"}}>
                        🛈
                      </Button>
                    </OverlayTrigger>
                    <div style = {{marginRight: "2%"}}>
                      Every
                    </div>
                    <Form.Control
                      as = "input"
                      style = {{marginRight: "2%"}}
                    />
                    <div>
                      miles
                    </div>
                    </InputGroup>
                    <InputGroup size = "sm" style = {{marginTop: "5%"}}>
                      <div style = {{marginRight: "2%"}}>
                        or
                      </div>
                      <Form.Control
                        as = "input"
                        style = {{marginRight: "2%"}}
                      />
                      <Form.Control
                        as = "select"
                        style = {{marginRight: "2%"}}
                      >
                        <option> Day(s) </option>
                        <option> Week(s) </option>
                      </Form.Control>
                    </InputGroup>
                </Col>
                <Col sm = {2} style = {{textAlign: "center"}}>
                  <br/>
                  <Button size = "sm" variant = "success">
                    Apply
                  </Button>
                </Col>
              </Row>
              <br/>
              <Row>
                <Col style = {{marginLeft: "1%"}}>
                  <Form.Check
                    type = "checkbox"
                    id = "select-all"
                    label = "Select All"
                  />
                </Col>
              </Row>
              {cars.map((car) => {
                return (
                  <Row>
                    <Col>
                      <ListGroup horizontal>
                        <ListGroup.Item>
                          <Row  style = {{marginBottom: "3%"}}>
                            <Col>
                              <Form.Check
                                type = "checkbox"
                                id = "select-all"
                                label = {<p> <strong> {car.name} </strong> </p>}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col sm = {5} style = {{marginBottom: "3%"}}>
                              <Form.Label> 💨 Mile Interval </Form.Label>
                              <Form.Control
                                size = "sm"
                                as = "input"
                                name = "date"
                                value = {sst.carsScheduled[car.carId].date}
                              />
                            </Col>
                            <Col sm = {7}>
                              <Form.Label> 🕒 Time Interval </Form.Label>
                              <InputGroup size = "sm">
                                <Form.Control
                                  as = "input"
                                  style = {{marginRight: "2%"}}
                                />
                                <Form.Control
                                  as = "select"
                                >
                                  <option> Day(s) </option>
                                  <option> Week(s) </option>
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
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default SSTModal;
