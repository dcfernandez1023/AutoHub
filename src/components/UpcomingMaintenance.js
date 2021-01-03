import React, { useState, useEffect } from 'react';

import 'react-calendar/dist/Calendar.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Calendar from 'react-calendar';

const DB = require('../controllers/db.js');

function UpcomingMaintenance(props) {

  const [serviceLogs, setServiceLogs] = useState([]);

  useEffect(() => {
    getServiceLogs(props.cars);
  }, [props.cars])

  function getServiceLogs(cars) {
    for(var i = 0; i < cars.length; i++) {
      var car = cars[i];
      getServiceLog(car.carId);
    }
  }

  function getServiceLog(carId) {
    if(carId === undefined || carId === null) {
      return;
    }
    DB.getQuerey("carReferenceId", carId, "serviceLogs").onSnapshot(quereySnapshot => {
      if(quereySnapshot.docs.length > 1 || quereySnapshot.docs[0] === undefined) {
      }
      else {
        var serviceLog = quereySnapshot.docs[0].data();
        if(serviceLog !== undefined) {
          var len;
          var repairLen = serviceLog.repairLog.length;
          var scheduledLen = serviceLog.scheduledLog.length;
          if(repairLen > scheduledLen) {
            len = serviceLog.repairLog.length;
          }
          else {
            len = serviceLog.scheduledLog.length;
          }
        }
        serviceLogs.push(serviceLog);
      }
    });
  }

  return (
    <Row>
      <Col>
        <Card>
          <Card.Header>
            Upcoming Maintenance 🛠️
          </Card.Header>
          <Card.Body>
            You have nothing scheduled for your cars.
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default UpcomingMaintenance;
