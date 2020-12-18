import React, { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import { v4 as uuidv4 } from 'uuid';

const DB = require('../controllers/db.js');
const STORAGE = require('../controllers/storage.js');
const CARMODEL = require('../models/car.js');
const GENERICFUNCTIONS = require('../controllers/genericFunctions.js');

function CarModal(props) {

  const[isLoading, setIsLoading] = useState(false); //flag to toggle spinner
  const[showCarModal, setShowCarModal] = useState(false); //flag to display car modal
  const[newCar, setNewCar] = useState(); //state object for creating a new car
  const[newCarImage, setNewCarImage] = useState(); //temp holder for newCar image upload
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
    if(newCar.carId.trim().length === 0) {
      newCar.carId = GENERICFUNCTIONS.generateId();
    }
    newCar.userCreated = userCreated;
    if(newCarImage !== undefined) {
      STORAGE.uploadFile(newCarImage, "images/"+props.userInfo.uid+"/"+newCarImage.name,
        function(url) {
          newCar.imageUrl = url;
          DB.writeOne(newCar.carId, newCar, "cars",
            function() {
              handleCarModalClose();
              setIsLoading(false);
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
      DB.writeOne(newCar.carId, newCar, "cars",
        function() {
          handleCarModalClose();
          setIsLoading(false);
        },
        function(error) {
          //TODO: handle this error more elegantly
          alert(error.toString());
          setIsLoading(false);
        }
      );
    }
  }

  //function to handle car modal closing
  function handleCarModalClose() {
    props.setShow(false);
    setNewCar(CARMODEL.car);
    setNewCarImage();
    setShowCarModal(false);
    setCarModalFormValidated(false);
  }

  //function to handle adding values to newCar
  function onChangeNewCar(e) {
    var newCarCopy = JSON.parse(JSON.stringify(newCar));
    var name = [e.target.name][0];
    var value = e.target.value;
    newCarCopy[name] = value;
    setNewCar(newCarCopy);
    setCarModalFormValidated(false);
  }

  //handle submit for car modal form
  function handleCarModalSubmit(e) {
    const form = e.currentTarget;
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
      if(field.required && newCar[field.value].toString().trim().length === 0) {
        newCar[field.value] = "";
        isValid = false;
      }
    }
    return isValid;
  }

  if(newCar === undefined) {
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
                        value = {newCar[field.value]}
                        onChange = {(e) => {
                          onChangeNewCar(e);
                        }}
                      />
                      <Form.Control.Feedback type = "invalid">
                        Required
                      </Form.Control.Feedback>
                    </Col>
                );
              }
              else if(field.inputType === "select") {
                console.log(newCar);
                return (
                    <Col md = {field.modalColSpan} style = {{marginBottom: "1%"}}>
                      <Form.Label> {field.displayName} </Form.Label>
                      <Form.Control
                        required = {field.required}
                        as = {field.inputType}
                        name = {field.value}
                        onChange = {(e) => {
                          onChangeNewCar(e);
                        }}
                      >
                        {newCar.year.trim().length === 0 ?
                          <option value = "" selected disabled hidden> Select </option>
                          :
                          <div></div>
                        }
                        {field.modalSelectData.map((data) => {
                          if(data === Number(newCar.year)) {
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
                        value = {newCar[field.value]}
                        onChange = {(e) => {
                          onChangeNewCar(e);
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
                      var newCarCopy = JSON.parse(JSON.stringify(newCar));
                      var file = e.target.files[0];
                      if(file) {
                        var extension = file.name.split('.').pop();
                        var imageId = GENERICFUNCTIONS.generateId();
                        var fileType = file.type;
                        newCarCopy.imageId = imageId;
                        newCarCopy.imageType = fileType;
                        var renamedFile = new File([file], imageId + "." + extension, {
                          type: fileType
                        });
                        setNewCarImage(renamedFile);
                        setNewCar(newCarCopy);
                      }
                      else {
                        setNewCarImage();
                        newCarCopy.imageId = "";
                        setNewCar(newCarCopy);
                      }
                    }}
                  />
                </Form.Group>
              </Form>
            </Col>
            <Col>
              <Button type = "submit" variant = "success" disabled = {isLoading} style = {{float: "right", marginTop: "10%"}}>
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
