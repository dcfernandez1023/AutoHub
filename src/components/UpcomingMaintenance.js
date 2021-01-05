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
  const[isCalendar, setIsCalendar] = useState(false);
  const[isLoading, setIsLoading] = useState(false);

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
        if(quereySnapshot.docs.length > 1 || quereySnapshot.docs[0] === undefined) {
          return;
        }
        else {
          var serviceLog = quereySnapshot.docs[0].data();
          if(serviceLog !== undefined) {
            var logs = serviceLogs.slice();
            logs.push(serviceLog);
            setServiceLogs(logs);
            setIsLoading(false);
          }
        }
      });
    }
    else {
      DB.getQuerey("userCreated", props.userCreated, "serviceLogs").onSnapshot(quereySnapshot => {
        if(quereySnapshot.docs.length < 1 || quereySnapshot.docs === undefined) {
          return;
        }
        else {
          if(serviceLogs !== undefined) {
            var logs = serviceLogs.slice();
            for(var i = 0; i < quereySnapshot.docs.length; i++) {
              logs.push(quereySnapshot.docs[i].data());
            }
            setServiceLogs(logs);
            setIsLoading(false);
          }
        }
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

  function getUpcomingServices(log) {
    var upcoming = [];
    var today = new Date();
    for(var i = 0; i < log.scheduledLog.length; i++) {
      var service = log.scheduledLog[i];
      var currMileage = Number(findCar(log.carReferenceId).mileage);
      if(new Date(service.nextServiceDate).getTime() >= today.getTime() || Number(service.nextServiceMileage.toString().trim()) >= currMileage && Number(service.nextServiceMileage.toString().trim()) !== 0) {
        upcoming.push(service);
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
    if(service.nextServiceDate.trim().length !== 0 && new Date(service.nextServiceDate).getTime() >= today.getTime()) {
      text = text + " " + service.nextServiceDate.trim();
      isDate = true;
    }
    if(Number(service.nextServiceMileage.toString().trim()) !== 0 && service.nextServiceMileage.toString().trim().length !== 0 && Number(service.nextServiceMileage) >= currMileage) {
      if(isDate) {
        text = text + " or " + service.nextServiceMileage.toString().trim() + " miles";
      }
      else {
        text = text + " " + service.nextServiceMileage.toString().trim() + " miles";
      }
    }
    return text;
  }

  if(props.cars === undefined) {
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
                  {serviceLogs.map((log) => {
                    var upcoming = getUpcomingServices(log);
                    upcomingCount += upcoming.length;
                    return (
                      <div>
                        {upcoming.map((service) => {
                          return (
                            <div style = {{border: "1px solid white"}}>
                              <Row>
                                <Col>
                                  <h6> {getCarName(log.carReferenceId) + " - " + service.serviceName} </h6>
                                </Col>
                              </Row>
                              <Row>
                                <Col>
                                  <Badge variant = "warning">
                                    {getDueText(service, log.carReferenceId)}
                                  </Badge>
                                </Col>
                              </Row>
                              <hr style = {{border: "1px solid lightGray", height: "50%"}} />
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                  {upcomingCount === 0 ?
                    <div> You have nothing scheduled for your cars. </div>
                    :
                    <div> </div>
                  }
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
