import React, { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';

import SSTModal from '../components/SSTModal.js';

const SSTModel = require('../models/scheduledServiceType.js');

const DB = require('../controllers/db.js');

function ScheduledServiceTypes(props) {

  const[ssts, setSsts] = useState();
  const[addShow, setAddShow] = useState(false);
  const[editShow, setEditShow] = useState(false);
  const[sstToEdit, setSstToEdit] = useState();
  const[cars, setCars] = useState();

  useEffect(() => {
    getCars();
  }, [props.userInfo])

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

  function addSst(sst) {
    DB.writeOne(sst.typeId, sst, "scheduledServiceTypes",
      function() {
        setAddShow(false);
      },
      function(error) {
        alert(error);
      }
    );
  }

  function editSst() {
    alert("Edit sst");
    return;
  }

  if(props.userInfo === undefined) {
    return (
      <Container fluid>
        <div style = {{textAlign: "center", marginTop: "3%"}}>
          <Spinner animation = "grow"/>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <SSTModal
        userCreated = {props.userInfo.email}
        cars = {cars}
        show = {addShow ? addShow : editShow ? editShow : false}
        sst = {addShow ? SSTModel.scheduledServiceType : editShow ? sstToEdit : undefined}
        setShow = {addShow ? setAddShow : editShow ? setEditShow : function() {setAddShow(false); setEditShow(false)}}
        title = {addShow ? "Add Scheduled Service Type" : editShow ? "Edit Scheduled Service Type" : ""}
        handleSubmit = {addShow ? addSst : editShow ? editSst : function() {return;}}
      />
      <br/>
      <Row>
        <Col>
          <h4 style = {{marginTop: "1%"}}>
            <Button variant = "outline-dark" style = {{marginRight: "1%"}}
                onClick = {() => {
                  setAddShow(true);
                }}
              >
                +
            </Button>
            Scheduled Service Types
          </h4>
        </Col>
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
