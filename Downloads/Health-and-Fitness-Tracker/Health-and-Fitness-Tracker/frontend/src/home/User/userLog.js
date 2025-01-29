import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import Navbar from '../../navigation-bar';
import LeftNav from '../../left-navigation';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ExportExcel from '../../exportExcel/exportData.js';


const UserLog = () => {
  const [logs, setLogs] = useState([]);

  const SERVER_URL = useSelector(state => state.generalInfo.SERVER_URL);
  const loginSession = useSelector(state => state.loginstate);

  const [activityType, setActivityType] = useState('');
  const [duration, setDuration] = useState(0);
  const [nutritionType, setNutritionType] = useState('');
  const [calories, setCalories] = useState(0);
  const [sleepDuration, setSleepDuration] = useState(0);

  const handleLogActivity = () => {
    if (activityType && duration > 0) {
      logData('Physical Activity', activityType, duration);
      setActivityType('');
      setDuration(0);
    }
  };

  const handleLogNutrition = () => {
    if (nutritionType && calories > 0) {
      logData('Nutrition', nutritionType, calories);
      setNutritionType('');
      setCalories(0);
    }
  };

  const handleLogSleep = () => {
    if (sleepDuration > 0) {
      logData('Sleep', 'Sleep', sleepDuration);
      setSleepDuration(0);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.post(SERVER_URL + 'getActivityLog', {emailID : loginSession.email})
        .then((response) => {
            if (response.data.success) {
                setLogs(response.data.log);
            } else {
                console.error('Error updating user access');
            }
        })


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const logData = (type, description, value) => {
    const newLog = {
      type,
      emailID: loginSession.email,
      description,
      value,
      timestamp: new Date(),
    };

    handleLogUplaod(newLog);
  };


  const handleLogUplaod = async(log) => {
    axios.post(SERVER_URL + 'postLog', {log: log})
    .then((response) => {
        if (response.data.success) {
            setLogs(response.data.logData);
        } else {
            alert('Error logging data');
        }
    })
    .catch((error) => {console.log(error)});
  }

  const getRowColor = (type) => {
    if(type === 'Physical Activity')
      return 'lightpink'
    else if(type === 'Nutrition')
      return '#40E0D0'
    else if (type === 'Sleep')
      return '#D2E3FF'
  };

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
                  <h2>Your Activity Log</h2>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form>
                    <Form.Group controlId="formActivityType">
                      <Form.Label><b>Activity Type</b></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter activity type (e.g., running, walking, pushup, swimming, etc.)"
                        value={activityType}
                        onChange={(e) => setActivityType(e.target.value)}
                      />
                    </Form.Group>
                    <br/>
                    <Button variant="primary" onClick={handleLogActivity}>
                      Log Activity
                    </Button>
                  </Form>
                </Col>
                <Col>
                  <Form>
                    <Form.Group controlId="formDuration">
                      <Form.Label><b>Duration (minutes)</b></Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter duration in minutes"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      />
                    </Form.Group>
                  </Form>
                </Col>
              </Row>

              {/* Logging Form for Nutrition */}
              <Row className="mt-4">
                <Col>
                  <Form>
                    <Form.Group controlId="formNutritionType">
                      <Form.Label><b>Nutrition Type</b></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter nutrition type (e.g., calories, fat, sugar, etc.)"
                        value={nutritionType}
                        onChange={(e) => setNutritionType(e.target.value)}
                      />
                    </Form.Group>
                    <br/>
                    <Button variant="primary" onClick={handleLogNutrition}>
                      Log Nutrition
                    </Button>
                  </Form>
                </Col>
                <Col>
                  <Form>
                    <Form.Group controlId="formCalories">
                      <Form.Label><b>Intake (grams)</b></Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter calories"
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                      />
                    </Form.Group>
                  </Form>
                </Col>
              </Row>

              {/* Logging Form for Sleep */}
              <Row className="mt-4">
                <Col>
                  <Form>
                    <Form.Group controlId="formSleepDuration">
                      <Form.Label><b>Sleep Duration (hours)</b></Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter sleep duration in hours"
                        value={sleepDuration}
                        onChange={(e) => setSleepDuration(e.target.value)}
                      />
                    </Form.Group>
                  </Form>
                </Col>
                <Col>
                  <Form>
                    <Form.Group controlId="formSleepDuration">
                      <br/>
                    </Form.Group>
                    <Button variant="primary" onClick={handleLogSleep}>
                      Log Sleep
                    </Button>
                  </Form>
                </Col>
              </Row>

              {/* Display Combined Log Table */}
              <Row className="mt-4">
                <Col>
                  <h4>Logged Activities, Nutritions, and Sleep</h4>
                  
                  <ExportExcel data={logs} fileName={"activityLogs"} />
                  <Table  bordered hover striped>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Value</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                    {logs.map((log, index) => (
                      <tr key={log._id}>
                        <td>{index+1}</td>
                        <td style={{ backgroundColor: getRowColor(log.type) }}>{log.type}</td>
                        <td>{log.description}</td>
                        <td>{log.value}</td>
                        <td>{log.timestamp.toLocaleString()}</td>
                      </tr>
                    ))}

                    </tbody>
                  </Table>
                </Col>
                
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLog;
