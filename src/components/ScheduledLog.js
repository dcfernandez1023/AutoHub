import React, { useState, useEffect } from 'react';

import "react-datepicker/dist/react-datepicker.css";

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import InputGroup from 'react-bootstrap/InputGroup';
import { v4 as uuidv4 } from 'uuid';
import DatePicker from "react-datepicker";

import SSTModal from './SSTModal.js';

const SSMODEL = require('../models/scheduledService.js');
const LOGOPTIONS = require('../models/logOptions.js');
const GENERICFUNCTIONS = require('../controllers/genericFunctions.js');
const DB = require('../controllers/db.js');
const SSTModel = require('../models/scheduledServiceType.js');

function ScheduledLog(props) {

  const[services, setServices] = useState([]);
  const[isSaved, setIsSaved] = useState(true);
  const[cars, setCars] = useState();
  const[servicesToDelete, setServicesToDelete] = useState([]);
  const[show, setShow] = useState(false);

  useEffect(() => {
    getCars();
    if(props.serviceLog !== undefined) {
      setServices(props.serviceLog.scheduledLog);
    }
  }, [props.userInfo, props.serviceLog])

  function addRow() {
    var newRow = JSON.parse(JSON.stringify(SSMODEL.scheduledService));
    var arr = services.slice();
    newRow.serviceId = GENERICFUNCTIONS.generateId();
    newRow.userCreated = props.userInfo.email;
    newRow.datePerformed = new Date();
    arr.push(newRow);
    setServices(arr);
    setIsSaved(false);
  }

  function deleteRow(index) {
    var arr = services.slice();
    var deleteArr = servicesToDelete.slice();
    var serviceTemp = JSON.parse(JSON.stringify(arr[index]));
    arr.splice(index, 1);
    deleteArr.push(serviceTemp);
    setServices(arr);
    setServicesToDelete(deleteArr);
    setIsSaved(false);
  }

  function onChangeCol(e, index) {
    var arr = services.slice();
    //var copy = JSON.parse(JSON.stringify(arr[index]));
    var copy = arr[index];
    copy.datePerformed = new Date(copy.datePerformed);
    var name = [e.target.name][0];
    var value = e.target.value;
    if(name === "serviceName") {
      if(value.length === 0) {
        copy.sstRefId = value;
        copy.serviceName = "";
      }
      else {
        for(var i = 0; i < props.ssts.length; i++) {
          if(props.ssts[i].typeId === value) {
            copy.sstRefId = value;
            copy.serviceName = props.ssts[i].serviceName;
            break;
          }
        }
      }
    }
    else {
      copy[name] = value;
    }
    //copy[name] = value;
    arr[index] = copy;
    setServices(arr);
    setIsSaved(false);
  }

  function onChangeDate(date, index) {
    var arr = services.slice();
    //var copy = JSON.parse(JSON.stringify(arr[index]));
    var copy = arr[index];
    copy.datePerformed = date;
    arr[index] = copy;
    setServices(arr);
    setIsSaved(false);
  }

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
    });
  }

  function saveServiceLog() {
    console.log(services);
    var copy = services.slice();
    console.log(copy);
    for(var i = 0; i < copy.length; i++) {
      if(copy[i].datePerformed === null || copy[i].datePerformed === undefined) {
        copy[i].datePerformed = new Date();
      }
      copy[i].datePerformed = copy[i].datePerformed.toLocaleDateString();
    }
    var serviceLog = JSON.parse(JSON.stringify(props.serviceLog));
  //  var serviceLog = props.serviceLog;
    serviceLog.scheduledLog = copy;
    DB.writeOne(props.serviceLog.logId, serviceLog, "serviceLogs",
      function() {
        setIsSaved(true);
        console.log(props.serviceLog);
        console.log(services);
      },
      function(error) {
        alert(error);
      }
    );
  }

  function getNextServiceMileage(sstId, serviceIndex) {
    for(var i = 0; i < props.ssts.length; i++) {
      if(props.ssts[i].typeId === sstId) {
        if(Object.keys(props.ssts[i].carsScheduled).length !== 0 && Number(props.ssts[i].carsScheduled[props.carId].miles) !== 0) {
          if(Number(services[serviceIndex].mileage) === 0) {
            return (Number(props.ssts[i].carsScheduled[props.carId].miles) + Number(props.car.mileage));
          }
          return (Number(props.ssts[i].carsScheduled[props.carId].miles) + Number(services[serviceIndex].mileage));
        }
      }
    }
    return "None";
  }

  function getNextServiceDate(sstId, serviceIndex) {
    for(var i = 0; i < props.ssts.length; i++) {
      if(props.ssts[i].typeId === sstId) {
        if(Object.keys(props.ssts[i].carsScheduled).length !== 0 && Number(props.ssts[i].carsScheduled[props.carId].time.quantity !== 0)) {
          var dateObj = new Date(services[serviceIndex].datePerformed);
          var timeUnits = props.ssts[i].carsScheduled[props.carId].time.units;
          var timeStep = Number(props.ssts[i].carsScheduled[props.carId].time.quantity);
          return GENERICFUNCTIONS.incrementDate(dateObj,timeUnits, timeStep).toLocaleDateString();
        }
      }
    }
    return "None";
  }


/*
  function getServices() {
    if(props.userInfo === undefined) {
      return;
    }
    DB.getQuerey("userCreated", props.userInfo.email, "scheduledServices").onSnapshot(quereySnapshot => {
      var services = [];
      for(var i = 0; i < quereySnapshot.docs.length; i++) {
        services.push(quereySnapshot.docs[i].data());
      }
      setServices(services);
    });
  }

  function saveRows() {
    DB.writeMany("serviceId", services, "scheduledServices")
      .then((res) => {
        if(servicesToDelete.length !== 0) {
          DB.deleteMany("serviceId", servicesToDelete, "scheduledServices")
            .then((res) => {
              setIsSaved(true);
            })
            .catch((error) => {
              alert(error);
            });
        }
        else {
          setIsSaved(true);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }
  */

  return (
    <Container fluid>
      <SSTModal
        userCreated = {props.userInfo.email}
        cars = {cars !== undefined ? cars : []}
        sst = {SSTModel.scheduledServiceType}
        show = {show}
        setShow = {setShow}
        title = "Add Scheduled Service Type"
      />
      <Row>
        <Col xs = {6}>
          <DropdownButton variant = "dark" size = "sm" title = "Filter By">
            {LOGOPTIONS.filterOptions.map((option, index) => {
              return (
                <div style = {{margin: "5%"}}>
                  <Form.Check
                    id = {option.value + index.toString()}
                    type = "checkbox"
                    label = {option.displayName}
                  />
                </div>
              );
            })}
          </DropdownButton>
        </Col>
        <Col xs = {6} style = {{textAlign: "right"}}>
          <Button variant = "dark" size = "sm"
            onClick = {() => {addRow()}}
          >
            Add Row
          </Button>
        </Col>
      </Row>
      <br style = {{height: "50%"}}/>
      <Row>
        <Col xs = {9}>
          <InputGroup size = "sm">
            <InputGroup.Prepend size = "sm">
              <InputGroup.Text> Sort By: </InputGroup.Text>
            </InputGroup.Prepend>
            <div>
              <Form.Control
                as = "select"
                size = "sm"
              >
                <option value = "" selected> None </option>
                {LOGOPTIONS.sortOptions.map((option) => {
                  return (
                    <option value = {option.value}> {option.displayName} </option>
                  );
                })}
              </Form.Control>
            </div>
          </InputGroup>
        </Col>
        <Col xs = {3} style = {{textAlign: "right"}}>
          <Button size = "sm" variant = "success" disabled = {isSaved}
            onClick = {() => {
              console.log(services);
              saveServiceLog();
            }}
          >
            Save
          </Button>
        </Col>
      </Row>
      <br/>
      <Table responsive bordered>
        <thead>
          <tr>
            <th style = {{minWidth: "50px"}}> # </th>
            {SSMODEL.publicFields.map((field, index) => {
              if(field.headerButtonValue.trim().length !== 0) {
                return (
                  <th style = {{minWidth: field.tableWidth}}>
                    <Button size = "sm" variant = "outline-dark" style = {{marginRight: "3%"}}
                      onClick = {() => {setShow(true)}}
                    >
                      {field.headerButtonValue}
                    </Button>
                    {field.displayName}
                  </th>
                );
              }
              return (
                <th style = {{minWidth: field.tableWidth}}>
                  {field.displayName}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {services.map((service, index) => {
            return (
              <tr key = {service.serviceId}>
                <td style = {{minWidth: "50px"}}>
                  <Button size = "sm" variant = "outline-dark"
                    onClick = {() => {deleteRow(index)}}
                  >
                    🗑️
                  </Button>
                </td>
                {SSMODEL.publicFields.map((field) => {
                  if(field.inputType === "input") {
                    if(field.value === "nextServiceMileage") {
                      return (
                        <td style = {{minWidth: field.tableWidth}}>
                          <Form.Control
                            size = "sm"
                            as = {field.inputType}
                            name = {field.value}
                            value = {getNextServiceMileage(service.sstRefId, index)}
                            disabled = {field.disabled}
                          />
                        </td>
                      );
                    }
                    if(field.value === "nextServiceDate") {
                      return (
                        <td style = {{minWidth: field.tableWidth}}>
                          <Form.Control
                            size = "sm"
                            as = {field.inputType}
                            name = {field.value}
                            value = {getNextServiceDate(service.sstRefId, index)}
                            disabled = {field.disabled}
                          />
                        </td>
                      );
                    }
                    if(field.value === "datePerformed") {
                      return (
                        <td style = {{minWidth: field.tableWidth}}>
                          <DatePicker
                            selected = {typeof(services[index].datePerformed) === "string" ? new Date(services[index].datePerformed) : services[index].datePerformed}
                            onChange = {(date) => {onChangeDate(date, index)}}
                            customInput = {<Form.Control as = "input" size = "sm"/>}
                          />
                        </td>
                      );
                    }
                    if(field.containsPrepend) {
                      return (
                        <td style = {{minWidth: field.tableWidth}}>
                          <InputGroup size = "sm">
                            <InputGroup.Prepend>
                              <InputGroup.Text> {field.prependValue} </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                              size = "sm"
                              as = {field.inputType}
                              name = {field.value}
                              value = {services[index][field.value]}
                              onChange = {(e) => {onChangeCol(e, index)}}
                              disabled = {field.disabled}
                            />
                          </InputGroup>
                        </td>
                      );
                    }
                    return (
                      <td style = {{minWidth: field.tableWidth}}>
                        <Form.Control
                          size = "sm"
                          as = {field.inputType}
                          name = {field.value}
                          value = {services[index][field.value]}
                          onChange = {(e) => {onChangeCol(e, index)}}
                          disabled = {field.disabled}
                        />
                      </td>
                    );
                  }
                  else if(field.inputType === "select") {
                    return (
                      <td style = {{minWidth: field.tableWidth}}>
                        <Form.Control
                          size = "sm"
                          as = {field.inputType}
                          name = {field.value}
                          value = {services[index].sstRefId}
                          onChange = {(e) => {
                            onChangeCol(e, index);
                          }}
                          disabled = {field.disabled}
                        >
                          <option value = "" selected> Select </option>
                          {props.ssts.map((sst, sstIndex) => {
                            var strIndex = sstIndex.toString();
                            return (
                              <option value = {sst.typeId}> {sst.serviceName} </option>
                            );
                          })}
                        </Form.Control>
                      </td>
                    );
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      {services.length === 0 ?
        <div>
          <Row>
            <Col>
              <br/>
              <br/>
              <br/>
            </Col>
          </Row>
          <Row>
            <Col style = {{textAlign: "center"}}>
              <h4> No Scheduled Services have been logged 👨‍🔧 </h4>
            </Col>
          </Row>
        </div>
        :
        <div></div>
      }
    </Container>
  );
}

export default ScheduledLog;
