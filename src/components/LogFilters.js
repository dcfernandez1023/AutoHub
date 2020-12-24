import React, { useState, useEffect } from 'react';

import "react-datepicker/dist/react-datepicker.css";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import DatePicker from "react-datepicker";
import ListGroup from 'react-bootstrap/ListGroup';

function LogFilters(props) {

  const[selectedFilter, setSelectedFilter] = useState("");

  const[startDate, setStartDate] = useState();
  const[endDate, setEndDate] = useState();

  const[startMileage, setStartMileage] = useState(0);
  const[endMileage, setEndMileage] = useState(0);

  const[serviceName, setServiceName] = useState("");
  const[names, setNames] = useState([]);

  useEffect(() => {
    if(props.serviceNames !== undefined) {
      setNames(props.serviceNames);
    }
  }, [props.serviceNames]);

  const FILTERS = [
    {value: "date", displayName: "Date"},
    {value: "mileage", displayName: "Mileage"},
    {value: "serviceName", displayName: "Service Name"}
  ];

  function renderFilterOptions() {
    if(selectedFilter.trim().length === 0) {
      return <div></div>;
    }
    if(selectedFilter === "date") {
      return (
        <Row>
          <Col sm = {6}>
            <DatePicker
              selected = {startDate}
              onChange = {(date) => {setStartDate(date)}}
              customInput = {
                <div>
                  <Form.Label> Start Date </Form.Label>
                  <Form.Control
                    as = "input"
                    size = "sm"
                  />
                </div>
              }
            />
          </Col>
          <Col sm = {6}>
            <DatePicker
              selected = {endDate}
              onChange = {(date) => {setEndDate(date)}}
              customInput = {
                <div>
                  <Form.Label> End Date </Form.Label>
                  <Form.Control
                    as = "input"
                    size = "sm"
                  />
                </div>
              }
            />
          </Col>
        </Row>
      );
    }
    if(selectedFilter === "mileage") {
      return (
        <Row>
          <Col sm = {6}>
            <Form.Label> Start Mileage </Form.Label>
            <Form.Control
              as = "input"
              size = "sm"
              value = {startMileage}
              onChange = {(e) => {
                if(!isNaN(e.target.value)) {
                  setStartMileage(e.target.value);
                }
              }}
            />
          </Col>
          <Col sm = {6}>
            <Form.Label> End Mileage </Form.Label>
            <Form.Control
              as = "input"
              size = "sm"
              value = {endMileage}
              onChange = {(e) => {
                if(!isNaN(e.target.value)) {
                  setEndMileage(e.target.value);
                }
              }}
            />
          </Col>
        </Row>
      );
    }
    if(selectedFilter === "serviceName") {
      return (
        <Row>
          <Col>
            <Row>
              <Col>
                <Form.Control
                  autoFocus
                  placeholder = "Enter a service name"
                  as = "input"
                  size = "sm"
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
      );
    }
  }

  return (
    <div style = {{margin: "3%"}}>
      <Row>
        {FILTERS.map((filter, index) => {
          return (
            <Col sm = {12}>
              <Form.Check
                type = "checkbox"
                checked = {selectedFilter === filter.value}
                id = {index.toString() + filter.value}
                label = {filter.displayName}
                onChange = {() => {
                  if(selectedFilter === filter.value) {
                    setSelectedFilter("");
                  }
                  else {
                    setSelectedFilter(filter.value);
                  }
                }}
              />
            </Col>
          );
        })}
      </Row>
      <Row>
        <Col>
          <hr style = {{border: "1px solid lightGray"}} />
        </Col>
      </Row>
      <Row>
        <Col>
          {renderFilterOptions()}
        </Col>
      </Row>
    </div>
  );
}

export default LogFilters;
