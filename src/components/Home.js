import React, { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import AppNavbar from './AppNavbar.js';

const DB = require('../controllers/db.js');

function Home(props) {

  return (
    <Container fluid>
      <AppNavbar/>
    </Container>
  );
}

export default Home;
