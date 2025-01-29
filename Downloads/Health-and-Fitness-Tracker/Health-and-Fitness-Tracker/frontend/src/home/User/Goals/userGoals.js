// src/home/User/UserGoals.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import Navbar from '../../../navigation-bar';
import LeftNav from '../../../left-navigation';
import WorkoutThumbnail from './index';
import './UserGoals.css';
import axios from 'axios';
import { useSelector } from 'react-redux';


const UserGoals = () => {

  const SERVER_URL = useSelector(state => state.generalInfo.SERVER_URL);
  const loginSession = useSelector(state => state.loginstate);

  const [userFitnessGoal, setUserFitnessGoal] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.post(SERVER_URL + 'getFitnessGoalClient', {
      email: loginSession.email,
  })
  .then(response => {
        setUserFitnessGoal(response.data.fitnessGoal);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching fitness goals:', error);
        setLoading(false);
      });
  }, []); 

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
              {/* Banner Section */}
              <Row>
                <Col>
                  <div className="banner-container">
                    <img className="banner-image" src="/banner.jpg" alt="Banner" />
                    <div className="banner-overlay">
                      <h2 className="textcol">Transform Your Body with Workouts</h2>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Display Fitness Goal */}
              <Row className="mt-4">
                <Col>
                  <h3>Fitness Goal: {userFitnessGoal}</h3>
                </Col>
              </Row>

              {/* Video Demonstrations Section */}
              <Row className="mt-4">
                <Col>
                  <Tabs defaultActiveKey="highIntensity" id="workoutCategories">
                    <Tab eventKey="highIntensity" title="High Intensity">
                      {/* Pass userFitnessGoal to WorkoutThumbnail */}
                      <WorkoutThumbnail fitnessGoal={userFitnessGoal} intensity="intense" />
                    </Tab>
                    <Tab eventKey="lowIntensity" title="Low Intensity">
                      {/* Pass userFitnessGoal to WorkoutThumbnail */}
                      <WorkoutThumbnail fitnessGoal={userFitnessGoal} intensity="beginner" />
                    </Tab>
                  </Tabs>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGoals;
