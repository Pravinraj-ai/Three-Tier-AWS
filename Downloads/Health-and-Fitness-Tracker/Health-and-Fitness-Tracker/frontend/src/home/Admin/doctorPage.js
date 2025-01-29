import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';

import NavBar from '../../navigation-bar';
import LeftNav from '../../left-navigation';

const DoctorAdmin = () => {
    const navigate = useNavigate();
    const loginSession = useSelector((state) => state.loginstate);
    const SERVER_URL = useSelector((store) => store.generalInfo.SERVER_URL);

    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showDoctorDetailModal, setShowDoctorDetailModal] = useState(false);
    const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);

    const [newDoctor, setNewDoctor] = useState({
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
          const doctorResponse = await axios.get('http://localhost:4000/getDoctors');
          setDoctors(doctorResponse.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }, []);

    const [validationError, setValidationError] = useState('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleDoctorDetailClick = (doctor) => {
        setSelectedDoctor(doctor);
        setShowDoctorDetailModal(true);
    };

    const handleDoctorDetailCloseModal = () => {
        setShowDoctorDetailModal(false);
    };

    const handleAddDoctorClick = () => {
        setNewDoctor({
          userName: '',
          emailID: '',
          contactNumber: '',
          qualification: '',
          specialization: '',
          address: '',
        })
        setShowAddDoctorModal(true);
    };

    const handleAddDoctorCloseModal = () => {
        setShowAddDoctorModal(false);
        setValidationError('');
    };

    const handleAddDoctor = async () => {
        if (!newDoctor.userName || !newDoctor.emailID || !newDoctor.contactNumber|| !newDoctor.age || !newDoctor.dateOfBirth ||!newDoctor.qualification || !newDoctor.specialization || !newDoctor.address) {
            setValidationError('Please fill in all the details.');
            return;
        }

        if (!emailRegex.test(newDoctor.emailID)) {
            setValidationError('Please enter a valid email address.');
            return;
        }
        try {
          const response = await axios.post('http://localhost:4000/addDoctor', newDoctor);

          if (response.data.success) {
              alert('Doctor added successfully');
              setDoctors(response.data.doctorData);
          } else {
              alert('Error adding new doctor');
          }
        } catch (error) {
              console.error('Error adding new doctor:', error);
        }

        handleAddDoctorCloseModal(); 
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewDoctor({
        ...newDoctor,
        [name]: value,
      });
    };

    const updateAccess = async (userType, mailID, active) => {
      if (window.confirm("Are you sure you want to update this doctors access?") === true) {
          axios.post(SERVER_URL + 'updateAccess', {userType: userType, mailID: mailID, active: active})
          .then((response) => {
              if (response.data.success) {
                  handleAddDoctorCloseModal();
                  setDoctors(response.data.presentData);
              } else {
                  console.error('Error updating doctors access');
              }
          })
          .catch((error) => {console.log(error)});
      } else {
          return;
      }
    };

    const specializationOptions = ['Cardiologists', 'Pulmonologists', 'Dietitians', 'Psychiatrists'];

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
                <h2>Available Doctors</h2>
                <Button variant="primary" onClick={handleAddDoctorClick}>
                  Add New Doctor
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
                  {doctors.map((item, index) => (
                    <tr key={item._id}>
                      <th scope="row">{index + 1}</th>
                      <td onClick={() => handleDoctorDetailClick(item)}><a style={{color:"black"}} href="javascript:void(0)">{item.userName}</a></td>
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

              {/* Doctor Details Modal */}
              <Modal show={showDoctorDetailModal} onHide={handleDoctorDetailCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Doctor Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedDoctor && (
                    <>
                      <p>
                        <strong>Name:</strong> {selectedDoctor.userName}
                      </p>
                      <p>
                        <strong>Email ID:</strong> {selectedDoctor.emailID}
                      </p>
                      <p>
                        <strong>Contact Number:</strong> {selectedDoctor.contactNumber}
                      </p>
                      <p>
                        <strong>Qualification:</strong> {selectedDoctor.qualification}
                      </p>
                      <p>
                        <strong>Specialization:</strong> {selectedDoctor.specialization}
                      </p>
                      <p>
                        <strong>Address:</strong> <br/> {selectedDoctor.address}
                      </p>
                      <div className="row">
                        <div className="col-8">
                          <p><strong>Date of Birth:</strong> {selectedDoctor.dateOfBirth}</p>
                        </div>
                        <div className="col-4">
                        <p><strong>Age:</strong> {selectedDoctor.age}</p>
                        </div>
                      </div>
                      <p>
                        <strong>Clients handling:</strong> {selectedDoctor.count}
                      </p>
                      {/* Add more fields as needed */}
                    </>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleDoctorDetailCloseModal}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={() => updateAccess("Doctor", selectedDoctor.emailID, selectedDoctor.active)}>
                        Change Account State
                  </Button>
                </Modal.Footer>
              </Modal>



              {/* Add Doctor Modal */}
              <Modal show={showAddDoctorModal} onHide={handleAddDoctorCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Add New Doctor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formName">
                      <Form.Label><b>Name</b></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter name"
                        name="userName"
                        value={newDoctor.name}
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
                        value={newDoctor.emailID}
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
                        value={newDoctor.contactNumber}
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
                        value={newDoctor.qualification}
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
                        value={newDoctor.specialization}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" selected disabled>Select Specialization</option>
                        {specializationOptions.map((item)  => <option value={item}>{item}</option>)}
{/*                       
                        <option value="Cardiologists">Cardiologists</option>
                        <option value="Pulmonologists">Pulmonologists</option>
                        <option value="Dietitians">Dietitians</option>
                        <option value="Psychiatrists">Psychiatrists</option> */}
                      </Form.Control>
                    </Form.Group>
                    <br/>
                    
                    <Form.Group controlId="formAddress">
                      <Form.Label><b>Address</b></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter address"
                        name="address"
                        value={newDoctor.address}
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
                        value={newDoctor.dateOfBirth}
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
                        value={newDoctor.age}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    <br/>
                    <p className="text-danger">{validationError}</p>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleAddDoctorCloseModal}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleAddDoctor}>
                    Add Doctor
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default DoctorAdmin;
