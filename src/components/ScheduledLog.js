import React, { useState, useEffect } from 'react';

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
  const[show, setShow] = useState(false);

  useEffect(() => {
    getCars();
  }, [props.userInfo])

  function addRow() {
    var newRow = JSON.parse(JSON.stringify(SSMODEL.scheduledService));
    var arr = services.slice();
    newRow.serviceId = GENERICFUNCTIONS.generateId();
    arr.push(newRow);
    setServices(arr);
    setIsSaved(false);
  }

  function deleteRow(index) {
    var arr = services.slice();
    arr.splice(index, 1);
    setServices(arr);
    setIsSaved(false);
  }

  function onChangeCol(e, index) {
    var arr = services.slice();
    var copy = JSON.parse(JSON.stringify(arr[index]));
    var name = [e.target.name][0];
    var value = e.target.value;
    copy[name] = value;
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
            onClick = {() => {setIsSaved(true)}}
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
                          value = {services[index][field.value]}
                          onChange = {(e) => {onChangeCol(e, index)}}
                        >
                          <option value = "" selected> Select </option>
                          {props.ssts.map((sst, index) => {
                            return (
                              <option value = {sst.serviceName}> {sst.serviceName} </option>
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
