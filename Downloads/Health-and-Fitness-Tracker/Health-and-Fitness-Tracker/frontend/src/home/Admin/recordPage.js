import React, { useState, useEffect } from 'react';
import axios from "axios";
import {useSelector} from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

import NavBar from '../../navigation-bar';
import LeftNav from '../../left-navigation';

const RecordAdmin = () => {
    const navigate = useNavigate();
    const loginSession = useSelector(state => state.loginstate);
    const SERVER_URL = useSelector(state => state.generalInfo.SERVER_URL);

    const [records, setRecords] = useState([]);
    const [selectedRecord, setSelectedClient] = useState(null);
    const [showUserDetailModal, setShowUserDetailModal] = useState(false);

    const handleUserDetailClick = (client) => {
        setSelectedClient(client);
        setShowUserDetailModal(true);
    };

    const handleUserDeatilCloseModal = () => {
        setShowUserDetailModal(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching data from server Hoooo");
          try {
            const recordResponse = await axios.get(SERVER_URL + 'getRecords');
            console.log(recordResponse.data);
            setRecords(recordResponse.data);

          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);
    
    const updateRecordState = async (recordID, active) => {
        if (window.confirm("Are you sure you want to update this record state?") === true) {
            axios.post(SERVER_URL + 'updateRecordState', {recordID: recordID, active: active})
            .then((response) => {
                if (response.data.success) {
                    handleUserDeatilCloseModal();
                    setRecords(response.data.recordData);
                } else {
                    alert('Error updating record');
                }
            })
            .catch((error) => {console.log(error)});
        } else {
            return;
        }
    };

    return (
        <div>
            <NavBar />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-2 p-0">
                        <LeftNav />
                    </div>
                    <div className="col-10 mt-5">
                        <h2>Clients, Doctors and Trainers</h2>
                        <br />
                
                        <table className="table">
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Client Name</th>
                                <th scope="col">Doctor Name ID</th>
                                <th scope="col">Trainer Name</th>
                                <th scope="col">Added By</th>
                                <th scope="col">Added On</th>
                                <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody>

                                {records.map((item, index) => (
                                <tr key={item._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td><a href="javascript:void(0)" style={{color: 'black'}} onClick={() => handleUserDetailClick(item)}>{item.userName}</a></td>
                                    <td>{item.doctorName}</td>
                                    <td>{item.trainerName}</td>
                                    <td>{item.adminName}</td>
                                    <td>{item.createdAt}</td>
                                    {
                                        item.active ? <td><span style={{color: 'green'}}>Active</span></td> : <td><span style={{color: 'red'}}>Not Active</span></td>
                                    }

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
                    <Modal.Title>Record Details</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    {selectedRecord && (
                    <>
                        <div className="row">
                            <div className="col-5">
                                <p><strong>Name:</strong><br/> {selectedRecord.userName}</p>
                            </div>
                            <div className="col-7">
                                <p><strong>Mail ID:</strong><br/> {selectedRecord.userMail}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-5">
                                <p><strong>Doctor Name:</strong><br/> {selectedRecord.doctorName}</p>
                            </div>
                            <div className="col-7">
                                <p><strong>Mail ID:</strong> <br/>{selectedRecord.doctorMail}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-5">
                                <p><strong>Trainer Name:</strong><br/> {selectedRecord.trainerName}</p>
                            </div>
                            <div className="col-7">
                                <p><strong>Mail ID:</strong><br/> {selectedRecord.trainerMail}</p>
                            </div>
                        </div>
                    </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => updateRecordState(selectedRecord.recordID, selectedRecord.active)}>
                        Update Record State
                    </Button>
                    <Button variant="secondary" onClick={handleUserDeatilCloseModal}>
                        Close 
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );

};

export default RecordAdmin;