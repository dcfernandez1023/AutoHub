import React, { useState, useEffect } from 'react';

import 'react-calendar/dist/Calendar.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Calendar from 'react-calendar';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';

const DB = require('../controllers/db.js');

function UpcomingMaintenance(props) {

  const [serviceLogs, setServiceLogs] = useState([]);
  const[isLoading, setIsLoading] = useState(false);
  const[upcomingServices, setUpcomingServices] = useState();
  const[overdueServices, setOverdueServices] = useState();

  useEffect(() => {
    getServiceLogs(props.cars);
  }, [props.cars])

  function getServiceLogs(cars) {
    if(cars === undefined) {
      return;
    }
    setIsLoading(true);
    if(cars.length === 1) {
      DB.getQuerey("carReferenceId", cars[0].carId, "serviceLogs").onSnapshot(quereySnapshot => {
        var logs = [];
        if(quereySnapshot.docs.length > 1 || quereySnapshot.docs[0] === undefined) {
          return;
        }
        else {
          var serviceLog = quereySnapshot.docs[0].data();
          if(serviceLog !== undefined) {
            logs.push(serviceLog);
            setServiceLogs(logs);
            setIsLoading(false);
          }
        }
        var upcoming = [];
        var overdue = [];
        for(var i = 0; i < logs.length; i++) {
          var log = logs[i]
          var u = getUpcomingServices(log)
          var o = getOverdueServices(log)
          for(var j = 0; j < u.length; j++) {
            upcoming.push(u[j]);
          }
          for(var n = 0; n < o.length; n++) {
            overdue.push(o[n]);
          }
        }
        setUpcomingServices(upcoming);
        setOverdueServices(overdue);
      });
    }
    else {
      DB.getQuerey("userCreated", props.userCreated, "serviceLogs").onSnapshot(quereySnapshot => {
        var logs = [];
        if(quereySnapshot.docs === undefined) {
          return;
        }
        else {
          if(serviceLogs !== undefined) {
            for(var i = 0; i < quereySnapshot.docs.length; i++) {
              logs.push(quereySnapshot.docs[i].data());
            }
            setServiceLogs(logs);
            setIsLoading(false);
          }
        }
        var upcoming = [];
        var overdue = [];
        for(var i = 0; i < logs.length; i++) {
          var log = logs[i]
          var u = getUpcomingServices(log)
          var o = getOverdueServices(log)
          for(var j = 0; j < u.length; j++) {
            upcoming.push(u[j]);
          }
          for(var n = 0; n < o.length; n++) {
            overdue.push(o[n]);
          }
        }
        setUpcomingServices(upcoming);
        setOverdueServices(overdue);
      });
    }
  }

  function findCar(carId) {
    if(carId === undefined || carId === null) {
      return null;
    }
    for(var i = 0; i < props.cars.length; i++) {
      if(props.cars[i].carId === carId) {
        return props.cars[i];
      }
    }
  }

  function getOverdueServices(log) {
    if(log === undefined || log === null) {
      return [];
    }
    var overdue = [];
    var sstIds = [];
    var today = new Date();
    var car = findCar(log.carReferenceId);
    if(car === null || car === undefined) {
      return [];
    }
    var currMileage = Number(car.mileage);
    for(var i = 0; i < log.scheduledLog.length; i++) {
      if(!sstIds.includes(log.scheduledLog[i].sstRefId)) {
        sstIds.push(log.scheduledLog[i].sstRefId);
      }
    }
    for(var i = 0; i < sstIds.length; i++) {
      var sstId = sstIds[i];
      var mostRecentDate = 0;
      var mostRecentService = null;
      for(var j = 0; j < log.scheduledLog.length; j++) {
        var service = log.scheduledLog[j];
        var datePerformed = new Date(service.datePerformed).getTime()
        if(service.sstRefId === sstId && datePerformed > mostRecentDate) {
          mostRecentDate = datePerformed;
          mostRecentService = service;
        }
      }
      if(mostRecentService !== null && new Date(mostRecentService.nextServiceDate).getTime() < today.getTime() || mostRecentService !== null && Number(mostRecentService.nextServiceMileage) < currMileage) {
        //same as saying: if the next service date and next service mileage are blank/empty, then they aren't overdue
        if(mostRecentService.nextServiceDate.toString().trim().length === 0 && mostRecentService.nextServiceMileage.toString().trim().length === 0) {
          continue;
        }
        overdue.push(mostRecentService);
      }
    }
    return overdue;
  }

  function getUpcomingServices(log) {
    if(log === undefined || log === null) {
      return [];
    }
    var upcoming = [];
    var sstIds = [];
    var today = new Date();
    var car = findCar(log.carReferenceId);
    if(car === null || car === undefined) {
      return [];
    }
    var currMileage = Number(car.mileage);
    for(var i = 0; i < log.scheduledLog.length; i++) {
      if(!sstIds.includes(log.scheduledLog[i].sstRefId)) {
        sstIds.push(log.scheduledLog[i].sstRefId);
      }
    }
    for(var i = 0; i < sstIds.length; i++) {
      var sstId = sstIds[i];
      var mostRecentDate = 0;
      var mostRecentService = null;
      for(var j = 0; j < log.scheduledLog.length; j++) {
        var service = log.scheduledLog[j];
        var datePerformed = new Date(service.datePerformed).getTime();
        if(service.sstRefId === sstId && datePerformed >= mostRecentDate) {
          mostRecentDate = datePerformed;
          mostRecentService = service;
        }
      }
      if(mostRecentService !== null && new Date(mostRecentService.nextServiceDate).getTime() >= today.getTime() || mostRecentService !== null && Number(mostRecentService.nextServiceMileage) >= currMileage) {
        //same as saying: if the mostRecentService is included within the overdue list, then don't add it to the upcoming list
        if(new Date(mostRecentService.nextServiceDate).getTime() < today.getTime() || mostRecentService !== null && Number(mostRecentService.nextServiceMileage) < currMileage) {
          continue;
        }
        upcoming.push(mostRecentService);
      }
    }
    return upcoming;
  }

  function getCarName(carId) {
    for(var i = 0; i < props.cars.length; i++) {
      var car = props.cars[i];
      if(car.carId === carId) {
        return car.name;
      }
    }
    return "";
  }

  function getDueText(service, carId) {
    var text = "Due:";
    var isDate = false;
    var currMileage = Number(findCar(carId).mileage);
    var today = new Date();
    if(service.nextServiceDate.trim().length !== 0) {
      text = text + " " + service.nextServiceDate.trim();
      isDate = true;
    }
    if(Number(service.nextServiceMileage.toString().trim()) !== 0 && service.nextServiceMileage.toString().trim().length !== 0) {
      if(isDate) {
        text = text + " or " + service.nextServiceMileage.toString().trim() + " miles";
      }
      else {
        text = text + " " + service.nextServiceMileage.toString().trim() + " miles";
      }
    }
    return text;
  }

  if(props.cars === undefined || upcomingServices === undefined || overdueServices === undefined) {
    if(isLoading) {
      return (
        <Container fluid>
          <div style = {{textAlign: "center", marginTop: "3%"}}>
            <Spinner animation = "border"/>
          </div>
        </Container>
      );
    }
    return (
      <Row>
        <Col>
          <Card>
            <Card.Header>
              Upcoming Maintenance 🛠️
            </Card.Header>
            <Card.Body>
              Error occurred in finding upcoming maintenance
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }

  //counter to determine if there is no upcoming maintenance
  var upcomingCount = 0;
  var overdueCount = 0;
  return (
    <Row>
      <Col>
        <Card>
          <Card.Header>
            Upcoming Maintenance 🛠️
          </Card.Header>
          <Card.Body>
            {serviceLogs.length === 0 ?
              <div> You have nothing scheduled for your cars. </div>
              :
              <Row>
                <Col>
                  <Row>
                    <Col>
                      <div>
                        {overdueServices.map((service) => {
                          return (
                            <div style = {{border: "1px solid white"}}>
                              <Row>
                                <Col xs = {8}>
                                  <h6>
                                    {getCarName(service.carReferenceId) + " - " + service.serviceName}
                                  </h6>
                                </Col>
                                <Col xs = {4} style = {{textAlign: "right"}}>
                                  <Badge variant = "danger">
                                    ! Overdue
                                  </Badge>
                                </Col>
                              </Row>
                              <Row>
                                <Col style = {{textIndent: "2%"}}>
                                  <small> ⌛ {getDueText(service, service.carReferenceId)} </small>
                                </Col>
                              </Row>
                              <hr style = {{border: "1px solid lightGray", height: "50%"}} />
                            </div>
                          );
                        })}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div>
                        {upcomingServices.map((service) => {
                          return (
                            <div style = {{border: "1px solid white"}}>
                              <Row>
                                <Col>
                                  <h6> {getCarName(service.carReferenceId) + " - " + service.serviceName} </h6>
                                </Col>
                              </Row>
                              <Row>
                                <Col style = {{textIndent: "2%"}}>
                                  <small> ⌛ {getDueText(service, service.carReferenceId)} </small>
                                </Col>
                              </Row>
                              <hr style = {{border: "1px solid lightGray", height: "50%"}} />
                            </div>
                          );
                        })}
                      </div>
                      {upcomingServices.length === 0 && overdueServices.length === 0 ?
                        <div> You have nothing scheduled for your cars. </div>
                        :
                        <div> </div>
                      }
                    </Col>
                  </Row>
                </Col>
              </Row>
            }
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default UpcomingMaintenance;
