import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';

import NavBar from '../../navigation-bar';
import LeftNav from '../../left-navigation';

const TrainerAdmin = () => {
    const navigate = useNavigate();
    const loginSession = useSelector((state) => state.loginstate);
    const SERVER_URL = useSelector((store) => store.generalInfo.SERVER_URL);

    const [trainers, setTrainers] = useState([]);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [showTrainerDetailModal, setShowTrainerDetailModal] = useState(false);
    const [showAddTrainerModal, setShowAddTrainerModal] = useState(false);

    const [newTrainer, setNewTrainer] = useState({
      userName: '',
      emailID: '',
      contactNumber: '',
      qualification: '',
      specialization: '',
      address: '',
    });

    useEffect(() => {
      const fetchData = async () => {
        try {
          const trainerResponse = await axios.get(SERVER_URL + 'getTrainers');
          setTrainers(trainerResponse.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }, []);

    const [validationError, setValidationError] = useState('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleTrainerDetailClick = (trainer) => {
        setSelectedTrainer(trainer);
        setShowTrainerDetailModal(true);
    };

    const handleTrainerDetailCloseModal = () => {
        setShowTrainerDetailModal(false);
    };

    const handleAddTrainerClick = () => {
        setNewTrainer({
          userName: '',
          emailID: '',
          contactNumber: '',
          qualification: '',
          specialization: '',
          address: '',
        })
        setShowAddTrainerModal(true);
    };

    const handleAddTrainerCloseModal = () => {
        setShowAddTrainerModal(false);
        setValidationError('');
    };
    
    const handleAddTrainer = async () => {
        if (!newTrainer.userName || !newTrainer.emailID || !newTrainer.contactNumber || !newTrainer.qualification || !newTrainer.specialization || !newTrainer.address) {
            setValidationError('Please fill in all the details.');
            return;
        }

        if (!emailRegex.test(newTrainer.emailID)) {
            setValidationError('Please enter a valid email address.');
            return;
        }
        try {
          const response = await axios.post(SERVER_URL + 'addTrainer', newTrainer);

          if (response.data.success) {
              alert('Trainer added successfully');
              setTrainers(response.data.trainerData);
          } else {
              alert('Error adding new trainer');
          }
        } catch (error) {
              console.error('Error adding new trainer:', error);
        }

        handleAddTrainerCloseModal(); 
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewTrainer({
        ...newTrainer,
        [name]: value,
      });
    };

    const updateAccess = async (userType, mailID, active) => {
      if (window.confirm("Are you sure you want to update this trainers access?") === true) {
          axios.post(SERVER_URL + 'updateAccess', {userType: userType, mailID: mailID, active: active})
          .then((response) => {
              if (response.data.success) {
                  handleTrainerDetailCloseModal();
                  setTrainers(response.data.presentData);
              } else {
                  console.error('Error updating trainers access');
              }
          })
          .catch((error) => {console.log(error)});
      } else {
          return;
      }
    };


    const specializationOptions = ['Personal Trainer', 'Physical Therapist', 'Yoga Instructor', 'Health Coach'];

    return (
      <div>
        <NavBar />
        <div className="container-fluid">
          <div className="row">
            <div className="col-2 p-0">
              <LeftNav />
            </div>
            <div className="col-10 mt-5">
              <div className="d-flex justify-content-between mb-3 align-items-center">
                <h2>Available Trainers</h2>
                <Button variant="primary" onClick={handleAddTrainerClick}>
                  Add New Trainer
                </Button>
              </div>
              <br />

              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email ID</th>
                    <th scope="col">Contact Number</th>
                    <th scope="col">Qualification</th>
                    <th scope="col">Specialization</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Account Status</th>
                    {/* Add more fields as needed */}
                  </tr>
                </thead>
                <tbody>
                  {trainers.map((item, index) => (
                    <tr key={item._id}>
                      <th scope="row">{index + 1}</th>
                      <td onClick={() => handleTrainerDetailClick(item)}><a style={{color:"black"}} href="javascript:void(0)">{item.userName}</a></td>
                      <td>{item.emailID}</td>
                      <td>{item.contactNumber}</td>
                      <td>{item.qualification}</td>
                      <td>{item.specialization}</td>
                      <td>{item.createdAt}</td>
                      {
                        item.active ? <td><span style={{color: 'green'}}>Active</span></td> : <td><span style={{color: 'red'}}>Blocked</span></td>
                      }
                      {/* Add more fields as needed */}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Trainer Details Modal */}
              <Modal show={showTrainerDetailModal} onHide={handleTrainerDetailCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Trainer Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedTrainer && (
                    <>
                      <p>
                        <strong>Name:</strong> {selectedTrainer.userName}
                      </p>
                      <p>
                        <strong>Email ID:</strong> {selectedTrainer.emailID}
                      </p>
                      <p>
                        <strong>Contact Number:</strong> {selectedTrainer.contactNumber}
                      </p>
                      <p>
                        <strong>Qualification:</strong> {selectedTrainer.qualification}
                      </p>
                      <p>
                        <strong>Specialization:</strong> {selectedTrainer.specialization}
                      </p>
                      <p>
                        <strong>Address:</strong> <br/>{selectedTrainer.address}
                      </p>
                      <div className="row">
                        <div className="col-8">
                          <p><strong>Date of Birth:</strong> {selectedTrainer.dateOfBirth}</p>
                        </div>
                        <div className="col-4">
                        <p><strong>Age:</strong> {selectedTrainer.age}</p>
                        </div>
                      </div>
                      <p>
                        <strong>Clients handling:</strong> {selectedTrainer.count}
                      </p>
                    </>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleTrainerDetailCloseModal}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={() => updateAccess("Trainer", selectedTrainer.emailID, selectedTrainer.active)}>
                        Change Account State
                  </Button>
                </Modal.Footer>
              </Modal>



              {/* Add Trainer Modal */}
              <Modal show={showAddTrainerModal} onHide={handleAddTrainerCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Add New Trainer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formName">
                      <Form.Label><b>Name</b></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter name"
                        name="userName"
                        value={newTrainer.name}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    <br/>
                    <Form.Group controlId="formEmail">
                      <Form.Label><b>Email ID</b></Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="emailID"
                        value={newTrainer.emailID}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group><br/>
                    <Form.Group controlId="formContactNumber">
                      <Form.Label><b>Contact Number</b></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter contact number"
                        name="contactNumber"
                        value={newTrainer.contactNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    <br/>
                    <Form.Group controlId="formQualification">
                      <Form.Label><b>Qualification</b></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter the qualification"
                        name="qualification"
                        value={newTrainer.qualification}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    <br/>
                    <Form.Group controlId="formSpecialization">
                      <Form.Label><b>Specialization</b></Form.Label>
                      <Form.Control
                        as="select"
                        name="specialization"
                        value={newTrainer.specialization}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled selected>Select Specialization</option>
                        {specializationOptions.map((item)  => <option value={item}>{item}</option>)}
                      </Form.Control>
                    </Form.Group>
                    <br/>
                    <Form.Group controlId="formAddress">
                      <Form.Label><b>Address</b></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter address"
                        name="address"
                        value={newTrainer.address}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    <br/>

                    <Form.Group controlId="formDOB">
                      <Form.Label><b>Date Of Birth</b></Form.Label>
                      <Form.Control
                        type="date"
                        name="dateOfBirth"
                        value={newTrainer.dateOfBirth}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    <br/>

                    <Form.Group controlId="formAge">
                      <Form.Label><b>Age</b></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Age"
                        name="age"
                        value={newTrainer.age}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    <br/>

                    <p className="text-danger">{validationError}</p>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleAddTrainerCloseModal}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleAddTrainer}>
                    Add Trainer
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default TrainerAdmin;
