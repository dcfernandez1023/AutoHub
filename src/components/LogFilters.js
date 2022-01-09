import React, { useState, useEffect } from 'react';

import "react-datepicker/dist/react-datepicker.css";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import DatePicker from "react-datepicker";
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

const LOGMODEL = require('../models/logOptions.js');

function LogFilters(props) {

  const[selectedFilters, setSelectedFilters] = useState([]);
  const[filterValues, setFilterValues] = useState(LOGMODEL.filterValues);

  const[startDate, setStartDate] = useState(null);
  const[endDate, setEndDate] = useState(null);

  const[startMileage, setStartMileage] = useState(0);
  const[endMileage, setEndMileage] = useState(0);

  const[serviceName, setServiceName] = useState("");
  const[names, setNames] = useState([]);

  useEffect(() => {
    if(props.serviceNames !== undefined) {
      setNames(props.serviceNames);
    }
  }, [props.serviceNames]);

  function isInDateRange(date) {
    if(startDate === null || startDate === undefined || endDate === null || endDate === undefined) {
      return false;
    }
    var time = date.getTime();
    if(startDate.getTime() <= time && time <= endDate.getTime()) {
      return true;
    }
    return false;
  }

  function isInMileageRange(mileage) {
    if(startMileage === undefined || endMileage === undefined) {
      return false;
    }
    if(startMileage <= mileage && mileage <= endMileage) {
      return true;
    }
    return false;
  }

  function isSameServiceName(name) {
    if(name.trim() === serviceName.trim()) {
      return true;
    }
    return false;
  }

  //TODO: make this dynamic based off the model
  function renderFilterOptions() {
    return (
      <Row style = {{padding: "5%", minWidth: "100px"}}>
        <Col>
          <Row style = {{marginBottom: "2%"}}>
            <Col style = {{textAlign: "left"}}>
              <div> <strong> Date </strong> </div>
            </Col>
          </Row>
          <Row>
            <Col sm = {6}>
              <DatePicker
                placeholderText = "Start"
                selected = {typeof(filterValues.startDate) === "string" ? new Date(filterValues.startDate) : filterValues.startDate}
                onChange = {(date) => {
                  var values = JSON.parse(JSON.stringify(filterValues));
                  var filters = selectedFilters.slice();
                  values.startDate = date;
                  setFilterValues(values);
                  if(values.startDate === null && values.endDate === null) {
                    if(filters.includes("date")) {
                      filters.splice(filters.indexOf("date"), 1);
                    }
                  }
                  else if(!filters.includes("date")) {
                    filters.push("date");
                  }
                  setSelectedFilters(filters);
                }}
                customInput = {
                  <Form.Control
                    as = "input"
                    size = "sm"
                  />
                }
              />
            </Col>
            <Col sm = {6}>
              <DatePicker
                placeholderText = "End"
                selected = {typeof(filterValues.endDate) === "string" ? new Date(filterValues.endDate) : filterValues.endDate}
                onChange = {(date) => {
                  var values = JSON.parse(JSON.stringify(filterValues));
                  var filters = selectedFilters.slice();
                  values.endDate = date;
                  setFilterValues(values);
                  if(values.startDate === null && values.endDate === null) {
                    if(filters.includes("date")) {
                      filters.splice(filters.indexOf("date"), 1);
                    }
                  }
                  else if(!filters.includes("date")) {
                    filters.push("date");
                  }
                  setSelectedFilters(filters);
                }}
                customInput = {
                  <Form.Control
                    as = "input"
                    size = "sm"
                  />
                }
              />
            </Col>
          </Row>
          <br style = {{height: "50%"}} />
          <Row style = {{marginBottom: "2%"}}>
            <Col style = {{textAlign: "left"}}>
              <div> <strong> Mileage </strong> </div>
            </Col>
          </Row>
          <Row>
            <Col sm = {6}>
              <Form.Control
                placeholder = "Start"
                as = "input"
                size = "sm"
                value = {filterValues.startMileage}
                onChange = {(e) => {
                  if(!isNaN(e.target.value)) {
                    var values = JSON.parse(JSON.stringify(filterValues));
                    var filters = selectedFilters.slice();
                    values.startMileage = e.target.value;
                    setFilterValues(values);
                    if(values.startMileage.trim().length === 0 && values.endMileage.trim().length === 0) {
                      if(filters.includes("mileage")) {
                        filters.splice(filters.indexOf("mileage"), 1);
                      }
                    }
                    else if(!filters.includes("mileage")) {
                      filters.push("mileage");
                    }
                    setSelectedFilters(filters);
                  }
                }}
              />
            </Col>
            <Col sm = {6}>
              <Form.Control
                placeholder = "End"
                as = "input"
                size = "sm"
                value = {filterValues.endMileage}
                onChange = {(e) => {
                  if(!isNaN(e.target.value)) {
                    var values = JSON.parse(JSON.stringify(filterValues));
                    var filters = selectedFilters.slice();
                    values.endMileage = e.target.value;
                    setFilterValues(values);
                    if(values.startMileage.trim().length === 0 && values.endMileage.trim().length === 0) {
                      if(filters.includes("mileage")) {
                        filters.splice(filters.indexOf("mileage"), 1);
                      }
                    }
                    else if(!filters.includes("mileage")) {
                      filters.push("mileage");
                    }
                    setSelectedFilters(filters);
                  }
                }}
              />
            </Col>
          </Row>
          <br style = {{height: "50%"}} />
          <Row>
            <Col>
            <Row style = {{marginBottom: "2%"}}>
              <Col style = {{textAlign: "left"}}>
                <div> <strong> Service Name </strong> </div>
              </Col>
            </Row>
              <Row>
                <Col>
                  <Form.Control
                    placeholder = "e.g. Oil Change"
                    as = "input"
                    size = "sm"
                    name = "serviceName"
                    value = {filterValues.serviceName}
                    onChange = {(e) => {
                      var values = JSON.parse(JSON.stringify(filterValues));
                      var filters = selectedFilters.slice();
                      values.serviceName = e.target.value;
                      setFilterValues(values);
                      if(values.serviceName.trim().length === 0) {
                        if(filters.includes("serviceName")) {
                          filters.splice(filters.indexOf("serviceName"), 1);
                        }
                      }
                      else if(!filters.includes("serviceName")) {
                        filters.push("serviceName");
                      }
                      setSelectedFilters(filters);
                    }}
                  />
                </Col>
              </Row>
              <br style = {{height: "50%"}} />
              <Row>
                <Col>
                  {names.map((name) => {
                    return (
                      <ListGroup flush>
                        <ListGroup.Item> {name} </ListGroup.Item>
                      </ListGroup>
                    );
                  })}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col style = {{textAlign: "right"}}>
              <Button variant = "secondary" size = "sm" style = {{marginRight: "2%"}}
                onClick = {() => {
                  setSelectedFilters([]);
                  setFilterValues(LOGMODEL.filterValues);
                }}
              >
                Clear
              </Button>
              <Button variant = "success" size = "sm"
                onClick = {() => {
                  props.applyFilters(selectedFilters, filterValues);
                  props.toggleFiltering(selectedFilters);
                }}
              >
                Apply
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  return (
    <div style = {{margin: "2%"}}>
      <Row>
        <Col>
          {renderFilterOptions()}
        </Col>
      </Row>
    </div>
  );
}

export default LogFilters;
