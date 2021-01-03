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
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';

import SSTModal from './SSTModal.js';
import LogFilters from './LogFilters.js';

const SSMODEL = require('../models/scheduledService.js');
const LOGMODEL = require('../models/logOptions.js');
const GENERICFUNCTIONS = require('../controllers/genericFunctions.js');
const DB = require('../controllers/db.js');
const SSTModel = require('../models/scheduledServiceType.js');

function ScheduledLog(props) {

  const[services, setServices] = useState([]);
  const[isSaved, setIsSaved] = useState(true);
  const[cars, setCars] = useState();
  const[show, setShow] = useState(false);
  const[filtered, setFiltered] = useState([]);
  const[isFiltering, setIsFiltering] = useState(false);
  const[sortToggleValue, setSortToggleValue] = useState("");
  const[sortValue, setSortValue] = useState("");
  const[toggleNotes, setToggleNotes] = useState("");
  const[currMileageId, setCurrMileageId] = useState({serviceId: "", mileage: -1});

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
    newRow.datePerformed = new Date().toLocaleDateString();
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

  function onChangeCol(e, index, type) {
    var arr = services.slice();
    var copy = arr[index];
    var name = [e.target.name][0];
    var value = e.target.value;
    if(type === "number" && isNaN(value)) {
      return;
    }
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
      if(name === "mileage" && copy.serviceId === currMileageId.serviceId) {
        setCurrMileageId({serviceId: currMileageId.serviceId, mileage: value});
      }
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
    copy.datePerformed = date.toLocaleDateString();
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
        copy[i].datePerformed = new Date().toLocaleDateString();
      }
      copy[i] = GENERICFUNCTIONS.trimInputs(copy[i]);
      //copy[i].datePerformed = copy[i].datePerformed.toLocaleDateString();
    }
    var serviceLog = JSON.parse(JSON.stringify(props.serviceLog));
    var car = JSON.parse(JSON.stringify(props.car));
    car.scheduledCost = calculateScheduledLogCost(copy);
    serviceLog.scheduledLog = copy;
    DB.writeOne(props.serviceLog.logId, serviceLog, "serviceLogs",
      function() {
        if(currMileageId.serviceId.trim().length !== 0) {
          if(currMileageId.mileage.toString().trim().length === 0) {
            car.mileage = 0;
          }
          else {
            car.mileage = Number(currMileageId.mileage.toString().trim());
          }
        }
        DB.writeOne(car.carId, car, "cars",
          function() {
            return;
          },
          function(error) {
            alert(error);
          }
        );
        setIsSaved(true);
        setCurrMileageId({serviceId: "", mileage: -1})
      },
      function(error) {
        alert(error);
      }
    );
  }

  function calculateScheduledLogCost(serviceLog) {
    var costs = {laborCost: 0, partsCost: 0};
    for(var i = 0; i < services.length; i++) {
      costs.laborCost += Number(services[i].laborCost);
      costs.partsCost += Number(services[i].partsCost);
    }
    console.log(costs);
    return costs;
  }

  function getNextServiceMileage(sstId, serviceIndex) {
    for(var i = 0; i < props.ssts.length; i++) {
      if(props.ssts[i].typeId === sstId) {
        if(props.ssts[i].carsScheduled[props.carId] === undefined) {
          props.ssts[i].carsScheduled[props.carId] = SSTModel.interval;
        }
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
        if(props.ssts[i].carsScheduled[props.carId] === undefined) {
          props.ssts[i].carsScheduled[props.carId] = SSTModel.interval;
        }
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
          return Number(serviceB[value]) - Number(serviceA[value]);
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
        <Col style = {{textAlign: "center"}}>
          <h5>
            {props.car.name + " "}
            <Badge variant = "secondary"> {props.car.mileage + " miles"} </Badge>
          </h5>
        </Col>
      </Row>
      <br style = {{height: "50%"}} />
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
        <Col xs = {8}>
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
        <Col xs = {4} style = {{textAlign: "right"}}>
          <Button size = "sm" variant = "success" disabled = {isSaved}
            onClick = {() => {
              saveServiceLog();
            }}
          >
            Save
          </Button>
        </Col>
      </Row>
      <br/>
      <Table responsive>
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
                  {SSMODEL.publicFields.map((field) => {
                    if(field.inputType === "input") {
                      if(field.value === "mileage") {
                        return (
                          <td style = {{minWidth: field.tableWidth}}>
                            <Form.Control
                              size = "sm"
                              as = {field.inputType}
                              name = {field.value}
                              value = {services[index][field.value]}
                              onChange = {(e) => {onChangeCol(e, index, field.type)}}
                              disabled = {field.disabled}
                            />
                            <Form.Check
                              size = "sm"
                              type = "checkbox"
                              id = "apply-mileage"
                              onChange = {() => {
                                setIsSaved(false);
                                if(service.serviceId === currMileageId.serviceId) {
                                  setCurrMileageId({serviceId: "", mileage: -1});
                                }
                                else {
                                  setCurrMileageId({serviceId: service.serviceId, mileage: service.mileage});
                                }
                              }}
                              label = {<small> Use as current mileage </small>}
                              checked = {service.serviceId === currMileageId.serviceId}
                            />
                          </td>
                        );
                      }
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
                      if(field.value === "notes") {
                        const popover = (
                          <Popover id = {"notes-popover" + service.serviceId} style = {{height: "100%"}}>
                            <Modal.Header closeButton style = {{backgroundColor: "#F2F4F4"}}>
                              Notes
                            </Modal.Header>
                            <Popover.Content>
                              Testing the popover component to display the notes for this service fjsdkfjsdklfjskdlfjsdklfjsdklfjskldfjslkdfjskldfjslkdfjskldfjkldsfjksldfjksldfjsdklfjskldfjsdfkjksldfjskdlfjsdklfjskdlfjdsklfdjslfjsdklfjsdlfjsdlkfjksldfjsdlfjskdlfjsldfjskdlfjsdklfjsdklfjsdklfjsdkljlkjfkdlsfjdkslfjslkdfjskldfjlskfjskldfjlsdjfljklfjdsklfjsdlkfjdlfjsdljfklj
                            </Popover.Content>
                          </Popover>
                        );
                        if(toggleNotes === service.serviceId) {
                          return (
                            <td style = {{minWidth: field.tableWidth}}>
                              <Form.Control
                                size = "sm"
                                as = "textarea"
                                name = {field.value}
                                value = {services[index][field.value]}
                                onChange = {(e) => {onChangeCol(e, index, field.type)}}
                                disabled = {field.disabled}
                                style = {{height: "150px"}}
                              />
                              <Button variant = "link" size = "sm" style = {{float: "right"}}
                                onClick = {() => {
                                  setToggleNotes("");
                                }}
                              >
                                Done
                              </Button>
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
                              onChange = {(e) => {onChangeCol(e, index, field.type)}}
                              disabled = {field.disabled}
                              readOnly
                            />
                            <Button variant = "link" size = "sm" style = {{float: "right"}}
                              onClick = {() => {
                                setToggleNotes(service.serviceId);
                              }}
                            >
                              Edit
                            </Button>
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
                                onChange = {(e) => {onChangeCol(e, index, field.type)}}
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
                            onChange = {(e) => {onChangeCol(e, index, field.type)}}
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
                            onChange = {(e) => {onChangeCol(e, index, field.type)}}
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
                              onChange = {(e) => {onChangeCol(e, index, field.type)}}
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
                                onChange = {(e) => {onChangeCol(e, index, field.type)}}
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
                            onChange = {(e) => {onChangeCol(e, index, field.type)}}
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
                            onChange = {(e) => {onChangeCol(e, index, field.type)}}
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
