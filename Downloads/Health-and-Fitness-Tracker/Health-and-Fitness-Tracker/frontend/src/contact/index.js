// src/home/Contact/Contact.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Navbar from '../navigation-bar';
import LeftNav from '../left-navigation';

const Contact = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-2 p-0">
            <LeftNav />
          </div>
          <div className="col-10 mt-5">
            <Container>
              <Row>
                <Col>
                  <h1>Contact Customer Support</h1>
                  <p>
                    For any inquiries or assistance, please feel free to reach out to our customer support team.
                  </p>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col>
                  <h4>Company Details:</h4>
                  <h2>
                    <img src="/logo.png" alt="User" className="imagesrc" />
                    <strong style={{ color: '#ddb42b' }}>Health and Fitness Tracker</strong>
                  </h2>
                  <p>123 Wellness Street</p>
                  <p>Fitness City, FC 54321</p>
                  <p><strong>Email:</strong> support@fitnesstracker.com</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                </Col>
              </Row>
              <Row className="mt-5">
                <Col className="text-center">
                  <p style={{ color: 'red', fontSize: '14px' }}>
                    © {currentYear} Health and Fitness Tracker. All rights reserved.
                  </p>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
