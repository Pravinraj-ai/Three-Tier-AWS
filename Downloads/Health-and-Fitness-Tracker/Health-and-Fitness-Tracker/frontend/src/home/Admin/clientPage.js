import React, { useState, useEffect } from 'react';
import axios from "axios";
import {useSelector} from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

import NavBar from '../../navigation-bar';
import LeftNav from '../../left-navigation';

const ClientAdmin = () => {
    const navigate = useNavigate();
    const loginSession = useSelector(state => state.loginstate);
    const SERVER_URL = useSelector(state => state.generalInfo.SERVER_URL);

    const [clients, setClients] = useState([]);
    const [newUsers, setNewUsers] = useState([]);

    const [doctors, setDoctors] = useState([]); 
    const [trainers, setTrainers] = useState([]);
    
    const [selectedClient, setSelectedClient] = useState(null);
    const [showUserDetailModal, setShowUserDetailModal] = useState(false);

    const [selectedNewClient, setSelectedNewClient] = useState(false);
    const [showNewUserModal, setshowNewUserModal] = useState(false);

    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedTrainer, setSelectedTrainer] = useState('');

    const [addError, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
          try {
            const clientResponse = await axios.get(SERVER_URL + 'getClients');
            setClients(clientResponse.data);

            const newUserResponse = await axios.get(SERVER_URL + 'getNewUsers');
            setNewUsers(newUserResponse.data);

            const doctorResponse = await axios.get(SERVER_URL + 'getDoctors');
            setDoctors(doctorResponse.data);

            const trainersResponse = await axios.get(SERVER_URL + 'getTrainers');
            setTrainers(trainersResponse.data);

          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);
    
    const handleUserDetailClick = (client) => {
        setSelectedClient(client);
        setShowUserDetailModal(true);
    };

    const handleUserDeatilCloseModal = () => {
        setShowUserDetailModal(false);
    };

    const deleteUser = async (userType, mailID,) => {
        if (window.confirm("Are you sure you want to delete this user ?") === true) {
            axios.post('http://localhost:4000/deleteAccount', {userType: userType, mailID: mailID})
            .then((response) => {
                if (response.data.success) {
                    handleUserDeatilCloseModal();
                    setClients(response.data.presentData);
                    setNewUsers(response.data.newData);
                } else {
                    console.error('Error updating user access');
                }
            })
            .catch((error) => {console.log(error)});
        } else {
            return;
        }
    };

    const updateAccess = async (userType, mailID, active) => {
        if (window.confirm("Are you sure you want to update this user access?") === true) {
            axios.post('http://localhost:4000/updateAccess', {userType: userType, mailID: mailID, active: active})
            .then((response) => {
                if (response.data.success) {
                    handleUserDeatilCloseModal();
                    setClients(response.data.presentData);
                    setNewUsers(response.data.newData);
                } else {
                    console.error('Error updating user access');
                }
            })
            .catch((error) => {console.log(error)});
        } else {
            return;
        }
    };

    const handleNewUserDetailClick = (client) => {
        setSelectedNewClient(client);
        setshowNewUserModal(true);
        setSelectedDoctor('');
        setSelectedTrainer('');
        setError('');
    };

    const handleNewUserDeatilCloseModal = () => {
        setshowNewUserModal(false);
    };

    const handleRequestAddClients = async (status) => {
        if(status) {
            if (!selectedNewClient || !selectedDoctor || !selectedTrainer) {
                setError('Please select all fields');
                return;
            }
        }
        
        try {
            const response = await axios.post(SERVER_URL + 'updateNewUser', {
                doctorID: selectedDoctor,
                trainerID: selectedTrainer,
                clientID: selectedNewClient.userID,
                adminID: loginSession.email,
                action: status,
            });
      
            if (response.data.success) {
                setClients(response.data.presentData);
                setNewUsers(response.data.newData);
                setSelectedNewClient('');
                setSelectedDoctor('');
                setSelectedTrainer('');
                setError('');
                if(status) {
                    alert('Client approved successfully.');
                } else {
                    alert('Client rejected successfully.')
                }
                handleNewUserDeatilCloseModal();
            } else {
                alert('Error updating client data.');
            }
          } catch (error) {
                alert('Error updating client data.');
          }  
    }

    return (
        <div>
            <NavBar />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-2 p-0">
                        <LeftNav />
                    </div>
                    <div className="col-10 mt-5">
                        <h2>Available Clients</h2>
                        <br />
                
                        <table className="table">
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Mail ID</th>
                                <th scope="col">Contact Number</th>
                                <th scope="col">Client Since</th>
                                <th scope="col">Account Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map((item, index) => (
                                <tr key={item._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td><a href="javascript:void(0)" style={{color: 'black'}} onClick={() => handleUserDetailClick(item)}>{item.userName}</a></td>
                                    <td>{item.emailID}</td>
                                    <td>{item.contactNumber}</td>
                                    <td>{item.createdAt}</td>
                                    {
                                        item.active ? <td><span style={{color: 'green'}}>Active</span></td> : <td><span style={{color: 'red'}}>Blocked</span></td>
                                    }

                                </tr>
                                ))}
                            </tbody>
                        </table>

                        <br/>
                        <hr/>
                        <br/>

                        <h2>New Clients</h2>
                        <br />
                
                        <table className="table">
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Mail ID</th>
                                <th scope="col">Contact Number</th>
                                <th scope="col">Client Since</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newUsers.map((item, index) => (
                                <tr key={item._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td><a href="javascript:void(0)" style={{color: 'black'}}  onClick={() => handleNewUserDetailClick(item)}>{item.userName}</a></td>
                                    <td>{item.emailID}</td>
                                    <td>{item.contactNumber}</td>
                                    <td>{item.createdAt}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>





            {/* MODEL User Details View Modal */}
            <Modal show={showUserDetailModal} onHide={handleUserDeatilCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    {selectedClient && (
                    <>
                        <div className="row">
                            <div className="col-5">
                                <p><strong>Name:</strong> {selectedClient.userName}</p>
                            </div>
                            <div className="col-7">
                                <p><strong>Contact Number:</strong> {selectedClient.contactNumber}</p>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-5">
                                <p><strong>D.O.B:</strong> {selectedClient.dateOfBirth}</p>
                            </div>
                            <div className="col-7">
                                <p><strong>Age:</strong> {selectedClient.age}</p>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <p><strong>Email ID:</strong> {selectedClient.emailID}</p>
                            </div>
                        </div>
                        
                        <p><strong>Address:</strong><br/>{selectedClient.address}</p>
                        
                        <div className="row">
                            <div className="col-5">
                                <p><strong>Gender:</strong> {selectedClient.gender}</p>
                            </div>
                            <div className="col-7">
                                <p><strong>Created On:</strong> {selectedClient.createdAt}</p>
                            </div>
                        </div>
                        
                        <div className="row">
                            <p><strong>Fitness Goal:</strong><br/>{selectedClient.fitnessGoals}</p>
                        </div>
                        <div className="row">
                            <p><strong>Health Data:</strong><br/>{selectedClient.healthData}</p>
                        </div>
                    </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => updateAccess("User", selectedClient.emailID, selectedClient.active)}>
                        Change Account State
                    </Button>
                    <Button variant="danger" onClick={() => deleteUser("User", selectedClient.emailID)}>
                        <i className="bi bi-trash"></i> Delete User
                    </Button>
                    <Button variant="secondary" onClick={handleUserDeatilCloseModal}>
                        Close 
                    </Button>
                </Modal.Footer>
            </Modal>




            {/* MODEL New User Modal */}
            <Modal show={showNewUserModal} onHide={handleNewUserDeatilCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>User Approvel Details</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    {selectedNewClient && (
                    <>
                        <div className="row">
                            <div className="col-5">
                                <p><strong>Name:</strong> {selectedNewClient.userName}</p>
                            </div>
                            <div className="col-7">
                                <p><strong>Contact Number:</strong> {selectedNewClient.contactNumber}</p>
                            </div>
                        </div>
                        
                        <div className="row">
                            <div className="col-5">
                                <p><strong>D.O.B:</strong> {selectedNewClient.dateOfBirth}</p>
                            </div>
                            <div className="col-7">
                                <p><strong>Age:</strong> {selectedNewClient.age}</p>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <p><strong>Email ID:</strong> {selectedNewClient.emailID}</p>
                            </div>
                        </div>
                        
                        <p><strong>Address:</strong><br/>{selectedNewClient.address}</p>
                        
                        <div className="row">
                            <div className="col-5">
                                <p><strong>Gender:</strong> {selectedNewClient.gender}</p>
                            </div>
                            <div className="col-7">
                                <p><strong>Created On:</strong> {selectedNewClient.createdAt}</p>
                            </div>
                        </div>
                        
                        <div className="row">
                            <p><strong>Fitness Goal:</strong><br/>{selectedNewClient.fitnessGoals}</p>
                        </div>
                        <div className="row">
                            <p><strong>Health Data:</strong><br/>{selectedNewClient.healthData}</p>
                        </div>

                        <br/>
                        <label htmlFor="doctor">
                            <strong>Doctor:</strong>
                        </label><br/>
                        <select id="doctor" className="form-control" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
                        <option value="" selected disabled>Select Doctor</option>
                        {doctors.map((doctor) => (
                            <option key={doctor._id} value={doctor.doctorID}>
                            {doctor.specialization} | {doctor.userName}
                            </option>
                        ))}
                        </select>
                    
                        <br/>
                        <label htmlFor="trainer">
                        <strong>Trainer:</strong>
                        </label><br/>
                        <select className="form-control" id="trainer" value={selectedTrainer} onChange={(e) => setSelectedTrainer(e.target.value)}>
                        <option value="" selected disabled>Select Trainer</option>
                        {trainers.map((trainer) => (
                            <option key={trainer._id} value={trainer.trainerID}>
                            {trainer.specialization} | {trainer.userName}
                            </option>
                        ))}
                        </select>
                        <br/>
                        <span style={{color: 'red'}}>{addError}</span>
                    </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => handleRequestAddClients(true)}>
                        Approve 
                    </Button>
                    <Button variant="danger" onClick={() => handleRequestAddClients(false)}>
                        Reject 
                    </Button>
                    <Button variant="secondary" onClick={handleNewUserDeatilCloseModal}>
                        Close 
                    </Button>
                    {/* <Button variant="primary" onClick={() => updateAccess("User", selectedClient.emailID, selectedClient.active)}>
                        Change Account State
                    </Button>
                    <Button variant="danger" onClick={() => deleteUser("User", selectedClient.emailID)}>
                        <i className="bi bi-trash"></i> Delete User
                    </Button> */}
                </Modal.Footer>
            </Modal>

        </div>
    );

};

export default ClientAdmin;