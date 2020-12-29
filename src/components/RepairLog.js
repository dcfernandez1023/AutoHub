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
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

import SSTModal from './SSTModal.js';
import LogFilters from './LogFilters.js';

const RSMODEL = require('../models/repairService.js');
const LOGMODEL = require('../models/logOptions.js');
const GENERICFUNCTIONS = require('../controllers/genericFunctions.js');
const DB = require('../controllers/db.js');
const SSTModel = require('../models/scheduledServiceType.js');

function RepairLog(props) {

  const[services, setServices] = useState([]);
  const[isSaved, setIsSaved] = useState(true);
  const[cars, setCars] = useState();
  const[show, setShow] = useState(false);
  const[filtered, setFiltered] = useState([]);
  const[isFiltering, setIsFiltering] = useState(false);
  const[sortToggleValue, setSortToggleValue] = useState("");
  const[sortValue, setSortValue] = useState("");

  useEffect(() => {
    getCars();
    if(props.serviceLog !== undefined) {
      setServices(props.serviceLog.repairLog);
    }
  }, [props.userInfo, props.serviceLog])

  function addRow() {
    var newRow = JSON.parse(JSON.stringify(RSMODEL.repairService));
    var arr = services.slice();
    newRow.serviceId = GENERICFUNCTIONS.generateId();
    newRow.userCreated = props.userInfo.email;
    newRow.datePerformed = new Date();
    newRow.mileage = props.car.mileage;
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
    var copy = arr[index];
    copy.datePerformed = new Date(copy.datePerformed);
    var copy = arr[index];
    var name = [e.target.name][0];
    var value = e.target.value;
    copy[name] = value;
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
    var copy = services.slice();
    for(var i = 0; i < copy.length; i++) {
      if(copy[i].datePerformed === null || copy[i].datePerformed === undefined) {
        copy[i].datePerformed = new Date();
      }
      copy[i].datePerformed = copy[i].datePerformed.toLocaleDateString();
    }
    var serviceLog = JSON.parse(JSON.stringify(props.serviceLog));
    serviceLog.repairLog = copy;
    DB.writeOne(props.serviceLog.logId, serviceLog, "serviceLogs",
      function() {
        setIsSaved(true);
      },
      function(error) {
        alert(error);
      }
    );
  }

  //filters the services into another array based on the selected filters
  //passed as props to LogFilters.js (the intended user of this function)
  /*
    filterNames - array of filters to apply (expecting "date", "mileage", and or "serviceName")
    filterValues - JSON object of filter values (ex: {startDate: "12/26/20", endDate: "12/28/20"} )
  */
  function applyFilters(filterNames, filteredValues) {
    var filtered = services.slice();
    for(var i = 0; i < filterNames.length; i++) {
      var filter = filterNames[i];
      var option = LOGMODEL.filterOptions[filter];
      var isValid = true;
      //if option is range, then check if filter values for the range filter have been satisfied
      //if values have been satisfied, then apply the filter
      //if values have not been satisfied, then do not apply the filter
      if(option !== undefined && option.filterType === "range") {
        if(filteredValues[option.rangeOptions[0].name] === LOGMODEL.filterValues[option.rangeOptions[0].name] || filteredValues[option.rangeOptions[1].name] === LOGMODEL.filterValues[option.rangeOptions[1].name]) {
          isValid = false;
        }
        if(isValid) {
          if(filter === "date") {
            filtered = filtered.filter(service =>
              new Date(filteredValues[option.rangeOptions[0].name]).getTime() <= new Date(service.datePerformed).getTime() && new Date(service.datePerformed).getTime() <= new Date(filteredValues[option.rangeOptions[1].name]).getTime());
          }
          else {
            filtered = filtered.filter(service =>
              Number(filteredValues[option.rangeOptions[0].name]) <= Number(service[filter]) && Number(service[filter]) <= Number(filteredValues[option.rangeOptions[1].name]));
          }
        }
      }
      //same as above, except for compare filter values
      else if(option !== undefined && option.filterType === "compare") {
        if(filteredValues[filter] === undefined || filteredValues[filter].trim().length === 0) {
          isValid = false;
        }
        if(isValid) {
          filtered = filtered.filter(service => filteredValues[filter] === service[filter]);
        }
      }
      setFiltered(filtered);
    }
  }

  function isInFiltered(id) {
    for(var i = 0; i < filtered.length; i++) {
      if(id === filtered[i].serviceId) {
        return true;
      }
    }
    return false;
  }

  function toggleFiltering(filters) {
    setIsFiltering(filters.length !== 0);
  }

  function sortAscending(value) {
    var copy = services.slice();
    copy.sort(
      function(serviceA, serviceB) {
        if(value === "date") {
          return new Date(serviceA.datePerformed).getTime() - new Date(serviceB.datePerformed).getTime();
        }
        else {
          return Number(serviceA[value]) - Number(serviceB[value]);
        }
      }
    );
    setServices(copy);
  }

  function sortDescending(value) {
    var copy = services.slice();
    copy.sort(
      function(serviceA, serviceB) {
        if(value === "date") {
          return new Date(serviceB.datePerformed).getTime() - new Date(serviceA.datePerformed).getTime();
        }
        else {
          return  Number(serviceB[value]) - Number(serviceA[value]);
        }
      }
    );
    setServices(copy);
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
            <LogFilters
              applyFilters = {applyFilters}
              toggleFiltering = {toggleFiltering}
            />
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
              <InputGroup.Text> Sort By </InputGroup.Text>
            </InputGroup.Prepend>
            <div style = {{marginRight: "1%"}}>
              <Form.Control
                as = "select"
                size = "sm"
                name = "sortBy"
                value = {sortValue}
                onChange = {(e) => {
                  var value = e.target.value;
                  setSortValue(value);
                  if(value.trim().length !== 0 && sortToggleValue.trim().length !== 0) {
                    if(sortToggleValue === "ascending") {
                      sortAscending(value);
                    }
                    else if(sortToggleValue === "descending") {
                      sortDescending(value);
                    }
                  }
                }}
              >
                <option value = "" selected> None </option>
                {LOGMODEL.sortOptions.map((option) => {
                  return (
                    <option value = {option.value}> {option.displayName} </option>
                  );
                })}
              </Form.Control>
            </div>
            <ButtonGroup toggle size = "sm"
            >
              <ToggleButton
                variant = "light"
                value = "ascending"
                type = "checkbox"
                name = "checkbox"
                value = {sortToggleValue}
                checked = {sortToggleValue === "ascending"}
                onChange = {() => {
                  if(sortToggleValue === "ascending") {
                    setSortToggleValue("");
                  }
                  else {
                    setSortToggleValue("ascending");
                    if(sortValue.trim().length !== 0) {
                      sortAscending(sortValue);
                    }
                  }
                }}
              >
                ⬆️
              </ToggleButton>
              <ToggleButton
                variant = "light"
                value = "descending"
                type = "checkbox"
                name = "checkbox"
                value = {sortToggleValue}
                checked = {sortToggleValue === "descending"}
                onChange = {() => {
                  if(sortToggleValue === "descending") {
                    setSortToggleValue("");
                  }
                  else {
                    setSortToggleValue("descending");
                    if(sortValue.trim().length !== 0) {
                      sortDescending(sortValue);
                    }
                  }
                }}
              >
                ⬇️
              </ToggleButton>
            </ButtonGroup>
          </InputGroup>
        </Col>
        <Col xs = {3} style = {{textAlign: "right"}}>
          <Button size = "sm" variant = "success" disabled = {isSaved}
            onClick = {() => {saveServiceLog()}}
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
            {RSMODEL.publicFields.map((field, index) => {
              return (
                <th style = {{minWidth: field.tableWidth}} key = {index.toString() + field.value}>
                  {field.displayName}
                </th>
              );
            })}
          </tr>
        </thead>
        {!isFiltering ?
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
                  {RSMODEL.publicFields.map((field) => {
                    if(field.inputType === "input") {
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
          :
          <tbody>
            {services.map((service, index) => {
              if(!isInFiltered(service.serviceId)) {
                return null;
              }
              return (
                <tr key = {service.serviceId}>
                  <td style = {{minWidth: "50px"}}>
                    <Button size = "sm" variant = "outline-dark"
                      onClick = {() => {deleteRow(index)}}
                    >
                      🗑️
                    </Button>
                  </td>
                  {RSMODEL.publicFields.map((field) => {
                    if(field.inputType === "input") {
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
        }
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
              <h4> No Repair Services have been logged 👨‍🔧 </h4>
            </Col>
          </Row>
        </div>
        :
        <div></div>
      }
    </Container>
  );
}

export default RepairLog;
