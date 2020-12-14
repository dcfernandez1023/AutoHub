import React, { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

function ScheduledServiceTypes(props) {

  const testData = [
    {
      userCreated: "test",
      typeId: "test1",
      serviceName: "Oil Change",
      cars: ["car1", "car2", "car3"],
      carDeadlines: {
        "car1": {date: "", miles: 500},
        "car2": {date: "every 6 months", miles: 1000},
        "car3": {date: "every year", miles: 2000}
      }
    },
    {
      userCreated: "test",
      typeId: "test2",
      serviceName: "Tire Rotation",
      cars: ["car1", "car2", "car3"],
      carDeadlines: {
        "car1": {date: "", miles: 5000},
        "car2": {date: "every 6 months", miles: 0},
        "car3": {date: "every year", miles: 4500}
      }
    }
  ]

  return (
    <Container>
      <br/>
      <Row>
        <Button variant = "outline-dark" style = {{marginRight: "1%"}}>
          +
        </Button>
        <h4 style = {{marginTop: "1%"}}> Scheduled Service Types </h4>
      </Row>
      <br/>
      <Row>
        <Col>
          <Accordion>
          {testData.map((service) => {
            return (
              <Card>
                <Card.Header>
                  <Accordion.Toggle as = {Button} variant = "light" eventKey = {service.typeId}>
                    {service.serviceName}
                  </Accordion.Toggle>
                  <Button variant = "outline-dark" style = {{float: "right"}}>
                    🗑️
                  </Button>
                  <Button variant = "outline-dark" style = {{float: "right", marginRight: "1%"}}>
                    ✏️
                  </Button>
                </Card.Header>
                <Accordion.Collapse eventKey = {service.typeId}>
                  <Card.Body>
                    {Object.keys(service.carDeadlines).map((car) => {
                      return (
                        <Row>
                          <Col>
                            <Row style = {{marginLeft: "1%"}}>
                              <Col>
                                <p> {car} </p>
                              </Col>
                            </Row>
                            <Row style = {{marginLeft: "4%", marginBottom: "1%"}}>
                              <p style = {{marginRight: "1%"}}> 📅 Date {service.carDeadlines[car].date} | </p>
                              <p> 🚗 Miles {service.carDeadlines[car].miles} </p>
                            </Row>
                          </Col>
                        </Row>
                      );
                    })}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            );
          })}
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
}

export default ScheduledServiceTypes;
