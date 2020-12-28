import React, { useState, useEffect } from 'react';

import "react-datepicker/dist/react-datepicker.css";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import DatePicker from "react-datepicker";
import ListGroup from 'react-bootstrap/ListGroup';

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
      <Row>
        <Col>
          <Row style = {{marginBottom: "2%"}}>
            <Col>
              <Form.Check
                type = "checkbox"
                id = "date-filter"
                label = "Date"
                onChange = {() => {
                  var filters = selectedFilters.slice();
                  if(filters.includes("date")) {
                    filters.splice(filters.indexOf("date"), 1)
                  }
                  else {
                    filters.push("date");
                  }
                  props.applyFilters(filters, filterValues);
                  setSelectedFilters(filters);
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col sm = {6}>
              <div> Start Date </div>
              <DatePicker
                selected = {typeof(filterValues.startDate) === "string" ? new Date(filterValues.startDate) : filterValues.startDate}
                onChange = {(date) => {
                  var values = JSON.parse(JSON.stringify(filterValues));
                  values.startDate = date;
                  setFilterValues(values);
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
              <div> End Date </div>
              <DatePicker
                selected = {typeof(filterValues.endDate) === "string" ? new Date(filterValues.endDate) : filterValues.endDate}
                onChange = {(date) => {
                  var values = JSON.parse(JSON.stringify(filterValues));
                  values.endDate = date;
                  setFilterValues(values);
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
          <hr style = {{border: "1px solid black"}} />
          <Row style = {{marginBottom: "2%"}}>
            <Col>
              <Form.Check
                type = "checkbox"
                id = "mileage-filter"
                label = "Mileage"
                onChange = {() => {
                  var filters = selectedFilters.slice();
                  if(filters.includes("mileage")) {
                    filters.splice(filters.indexOf("mileage"), 1)
                  }
                  else {
                    filters.push("mileage");
                  }
                  props.applyFilters(filters, filterValues);
                  setSelectedFilters(filters);
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col sm = {6}>
              <div> Start Mileage </div>
              <Form.Control
                as = "input"
                size = "sm"
                value = {filterValues.startMileage}
                onChange = {(e) => {
                  if(!isNaN(e.target.value)) {
                    var values = JSON.parse(JSON.stringify(filterValues));
                    values.startMileage = e.target.value;
                    setFilterValues(values);
                  }
                }}
              />
            </Col>
            <Col sm = {6}>
              <div> End Mileage </div>
              <Form.Control
                as = "input"
                size = "sm"
                value = {filterValues.endMileage}
                onChange = {(e) => {
                  if(!isNaN(e.target.value)) {
                    var values = JSON.parse(JSON.stringify(filterValues));
                    values.endMileage = e.target.value;
                    setFilterValues(values);
                  }
                }}
              />
            </Col>
          </Row>
          <hr style = {{border: "1px solid black"}} />
          <Row style = {{marginBottom: "2%"}}>
            <Col>
              <Form.Check
                type = "checkbox"
                id = "name-filter"
                label = "Service Name"
                onChange = {() => {
                  var filters = selectedFilters.slice();
                  if(filters.includes("serviceName")) {
                    filters.splice(filters.indexOf("serviceName"), 1)
                  }
                  else {
                    filters.push("serviceName");
                  }
                  props.applyFilters(filters, filterValues);
                  setSelectedFilters(filters);
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Row>
                <Col>
                  <Form.Control
                    placeholder = "Enter a service name"
                    as = "input"
                    size = "sm"
                    name = "serviceName"
                    value = {filterValues.serviceName}
                    onChange = {(e) => {
                      var values = JSON.parse(JSON.stringify(filterValues));
                      values.serviceName = e.target.value;
                      setFilterValues(values);
                    }}
                  />
                </Col>
              </Row>
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
