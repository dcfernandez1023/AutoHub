import React, { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function ErrorHandler({error, resetErrorBoundary}) {

  return (
    <Container>
      <br/>
      <Row style = {{marginBottom: "3%"}}>
        <Col style = {{textAlign: "center"}}>
          <h5> An unexpected error occurred 😵 </h5>
        </Col>
      </Row>
      <Row>
        <Col style = {{textAlign: "center"}}>
          <pre> <strong> Error Message: </strong>{error.message}</pre>
        </Col>
      </Row>
      <Row>
        <Col style = {{textAlign: "center"}}>
          <Button onClick = {resetErrorBoundary}>
            Try Again
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default ErrorHandler;
