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
              <h5> Apply to Cars </h5>
            </Col>
            <Col xs = {3} style = {{textAlign: "right"}}>
              {!toggleApply ?
                <Button variant = "outline-dark"
                  onClick = {() => {
                    setToggleApply(true);
                  }}
                >
                  ✏️
                </Button>
                :
                <Button variant = "outline-dark"
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
                        <ListGroup.Item>
                          <Row>
                            <Col xs = {4} style = {{marginBottom: "5%"}}>
                              <p> <strong> {car.name} </strong> </p>
                            </Col>
                            <Col sm = {4} style = {{marginBottom: "5%"}}>
                              <Form.Label> 💨 Miles </Form.Label>
                              <Form.Control
                                size = "sm"
                                as = "input"
                                name = "date"
                                value = {sst.carsScheduled[car.carId].date}
                              />
                            </Col>
                            <Col sm = {4}>
                              <Form.Label> 📅 Date </Form.Label>
                              <Form.Control
                                size = "sm"
                                as = "input"
                                name = "date"
                                value = {sst.carsScheduled[car.carId].date}
                              />
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
                <Col>
                  <Form.Label> 💨 Miles </Form.Label>
                </Col>
                <Col>
                  <Form.Label> 📅 Date </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Control
                    size = "sm"
                    as = "input"
                    name = "date"
                  />
                </Col>
                <Col>
                  <Form.Control
                    size = "sm"
                    as = "input"
                    name = "date"
                  />
                </Col>
              </Row>
              <br/>
              <Row>
                <Col style = {{textAlign: "right"}}>
                  <Button size = "sm" variant = "success" style = {{marginRight: "1%"}}>
                    Apply
                  </Button>
                  <OverlayTrigger
                    key = "apply-info"
                    placement = "bottom"
                    overlay = {
                      <Tooltip id = "apply-info-tooltip">
                        Enter the desired mile and/or date interval above and click the 'Apply' button
                        to apply it to the selected cars.
                      </Tooltip>
                    }
                  >
                    <Button size = "sm" variant = "light">
                      ❓
                    </Button>
                  </OverlayTrigger>
                </Col>
              </Row>

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
                          <Row>
                            <Col xs = {4} style = {{marginBottom: "5%"}}>
                              <Form.Check
                                type = "checkbox"
                                id = "select-all"
                                label = {<strong> {car.name} </strong>}
                              />
                            </Col>
                            <Col sm = {4} style = {{marginBottom: "5%"}}>
                              <Form.Label> 💨 Miles </Form.Label>
                              <Form.Control
                                disabled
                                size = "sm"
                                as = "input"
                                name = "date"
                                value = {sst.carsScheduled[car.carId].date}
                              />
                            </Col>
                            <Col sm = {4}>
                              <Form.Label> 📅 Date </Form.Label>
                              <Form.Control
                                disabled
                                size = "sm"
                                as = "input"
                                name = "date"
                                value = {sst.carsScheduled[car.carId].date}
                              />
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
