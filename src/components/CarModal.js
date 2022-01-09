import React, { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import { v4 as uuidv4 } from 'uuid';
import Spinner from 'react-bootstrap/Spinner';

const DB = require('../controllers/db.js');
const LOGMODEL = require('../models/serviceLog.js');
const STORAGE = require('../controllers/storage.js');
const CARMODEL = require('../models/car.js');
const GENERICFUNCTIONS = require('../controllers/genericFunctions.js');

function CarModal(props) {

  const[isLoading, setIsLoading] = useState(false); //flag to toggle spinner
  const[showCarModal, setShowCarModal] = useState(false); //flag to display car modal
  const[car, setNewCar] = useState(); //state object for creating a new car
  const[carImage, setCarImage] = useState(); //temp holder for car image upload
  const[carModalFormValidated, setCarModalFormValidated] = useState(false); //flag to toggle form validation of the car modal
  const[title, setTitle] = useState("");

  useEffect(() => {
    setNewCar(props.car);
    setShowCarModal(props.show);
    setTitle(props.title);
  }, [props.show, props.title, props.car])

  //adds a car to the cars db collectionName
  function saveCar() {
    if(props.userInfo === undefined) {
      //TODO: handle this error more elegantly
      alert("User data undefined. Cannot add new car");
      setCarModalFormValidated(false);
      return;
    }
    setIsLoading(true);
    var userCreated = props.userInfo.email;
    var isNew = false;
    if(car.carId.trim().length === 0) {
      car.carId = GENERICFUNCTIONS.generateId();
      isNew = true;
    }
    car.userCreated = userCreated;
    if(carImage !== undefined) {
      var extension = carImage.name.split('.').pop();
      var imageId = GENERICFUNCTIONS.generateId();
      var fileType = carImage.type;
      var prevImageUrl = "";
      if(car.imageUrl.trim().length !== 0) {
        prevImageUrl = car.imageUrl;
      }
      car.imageId = imageId;
      var renamedFile = new File([carImage], imageId + "." + extension, {
        type: fileType
      });
      STORAGE.uploadFile(renamedFile, "images/"+props.userInfo.uid+"/"+carImage.name, prevImageUrl,
        function(url) {
          car.imageUrl = url;
          DB.writeOne(car.carId, car, "cars",
            function() {
              if(isNew) {
                saveNewServiceLog(car.carId);
              }
              else {
                handleCarModalClose();
              }
            },
            function(error) {
              //TODO: handle this error more elegantly
              alert(error.toString());
              setIsLoading(false);
            }
          );
        }
      );
    }
    else {
      DB.writeOne(car.carId, car, "cars",
        function() {
          if(isNew) {
            saveNewServiceLog(car.carId);
          }
          else {
            handleCarModalClose();
          }
        },
        function(error) {
          //TODO: handle this error more elegantly
          alert(error.toString());
          setIsLoading(false);
        }
      );
    }
  }

  function saveNewServiceLog(carId) {
    var serviceLog = JSON.parse(JSON.stringify(LOGMODEL.serviceLog));
    serviceLog.userCreated = props.userInfo.email;
    serviceLog.logId = GENERICFUNCTIONS.generateId();
    serviceLog.carReferenceId = carId;
    DB.writeOne(serviceLog.logId, serviceLog, "serviceLogs",
      function() {
        handleCarModalClose();
      },
      function(error) {
        alert(error);
        setIsLoading(false);
      });
  }

  //function to handle car modal closing
  function handleCarModalClose() {
    setIsLoading(false);
    props.setShow(false);
    setNewCar(CARMODEL.car);
    setCarImage();
    setShowCarModal(false);
    setCarModalFormValidated(false);
  }

  //function to handle adding values to car
  function onChangeNewCar(e, type) {
    var carCopy = JSON.parse(JSON.stringify(car));
    //var carCopy = car;
    var name = [e.target.name][0];
    var value = e.target.value;
    if(type === "number" && isNaN(value)) {
      return;
    }
    carCopy[name] = value;
    setNewCar(carCopy);
    setCarModalFormValidated(false);
  }

  //handle submit for car modal form
  function handleCarModalSubmit(e) {
    setCarModalFormValidated(true);
    if(checkNewCarFields() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    else {
      saveCar();
      e.preventDefault();
      e.stopPropagation();
    }
  }

  //check if required fields have been filled
  function checkNewCarFields() {
    var isValid = true;
    for(var i = 0; i < CARMODEL.publicFields.length; i++) {
      var field = CARMODEL.publicFields[i];
      if(field.required && car[field.value].toString().trim().length === 0) {
        car[field.value] = "";
        isValid = false;
      }
      if(field.type === "number") {
        car[field.value] = Number(car[field.value].toString().trim());
      }
      else {
        car[field.value] = car[field.value].trim();
      }
    }
    return isValid;
  }

  if(car === undefined) {
    return <div></div>;
  }

  return (
    <Modal
      show = {showCarModal}
      onHide = {handleCarModalClose}
      backdrop = "static"
      keyboard = {false}
    >
      <Modal.Header closeButton>
        <Modal.Title> {title} </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated = {carModalFormValidated} onSubmit = {handleCarModalSubmit}>
          <Row style = {{marginLeft: "3%", marginRight: "3%"}}>
            {CARMODEL.publicFields.map((field) => {
              if(field.inputType === "input") {
                return (
                    <Col md = {field.modalColSpan} style = {{marginBottom: "1%"}}>
                      <Form.Label> {field.displayName} </Form.Label>
                      <Form.Control
                        required = {field.required}
                        as = {field.inputType}
                        name = {field.value}
                        value = {car[field.value]}
                        onChange = {(e) => {
                          onChangeNewCar(e, field.type);
                        }}
                      />
                      <Form.Control.Feedback type = "invalid">
                        Required
                      </Form.Control.Feedback>
                    </Col>
                );
              }
              else if(field.inputType === "select") {
                return (
                    <Col md = {field.modalColSpan} style = {{marginBottom: "1%"}}>
                      <Form.Label> {field.displayName} </Form.Label>
                      <Form.Control
                        required = {field.required}
                        as = {field.inputType}
                        name = {field.value}
                        onChange = {(e) => {
                          onChangeNewCar(e, field.type);
                        }}
                      >
                        {car.year.trim().length === 0 ?
                          <option value = "" selected disabled hidden> Select </option>
                          :
                          <div></div>
                        }
                        {field.modalSelectData.map((data) => {
                          if(data === Number(car.year)) {
                            return (
                              <option value = {data} selected> {data} </option>
                            )
                          }
                          return (
                            <option value = {data}> {data} </option>
                          );
                        })}
                      </Form.Control>
                      <Form.Control.Feedback type = "invalid">
                        Required
                      </Form.Control.Feedback>
                    </Col>
                );
              }
              else {
                return (
                    <Col md = {field.modalColSpan} style = {{marginBottom: "1%"}}>
                      <Form.Label> {field.displayName} </Form.Label>
                      <Form.Control
                        required = {field.required}
                        as = {field.inputType}
                        name = {field.value}
                        value = {car[field.value]}
                        onChange = {(e) => {
                          onChangeNewCar(e, field.type);
                        }}
                      />
                    </Col>
                );
              }
            })}
          </Row>
          <Row>
            <Col>
              <Form>
                <Form.Group>
                  <Form.Label> Image </Form.Label>
                  <Form.File
                    id = "image"
                    onChange = {(e) => {
                      var carCopy = JSON.parse(JSON.stringify(car));
                      var file = e.target.files[0];
                      if(file) {
                        setCarImage(file);
                        setNewCar(carCopy);
                      }
                      else {
                        setCarImage();
                        carCopy.imageId = "";
                        setNewCar(carCopy);
                      }
                    }}
                  />
                </Form.Group>
              </Form>
            </Col>
            <Col>
              <Button type = "submit" variant = "success" disabled = {isLoading} style = {{float: "right", marginTop: "10%"}}>
                {isLoading ?
                  <Spinner animation = "border" size = "sm" status = "role"/>
                  :
                  <div></div>
                }
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CarModal;
