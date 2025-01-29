import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';


import NavBar from '../../navigation-bar';
import LeftNav from '../../left-navigation';


const MyClient = () => {
  const [myClients, setMyClients] = useState([]);

  const SERVER_URL = useSelector(state => state.generalInfo.SERVER_URL);
  const loginSession = useSelector(state => state.loginstate);

  const [selectedClient, setSelectedClient] = useState('');
  const [showUserDetailModal, setShowUserDetailModal] = useState(false);
  const [clientActivity, setClientActivity] = useState([]);

  const handleUserDetailClick = (client) => {
    getActivityLog(client.userID);
    setSelectedClient(client);
    setShowUserDetailModal(true);
  };

  const handleUserDeatilCloseModal = () => {
      setClientActivity([]);
      setShowUserDetailModal(false);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const myClientResponse = await axios.post(SERVER_URL + 'getMyClients', {
          userType: loginSession.type,
          emailID: loginSession.email,
        });
        if (myClientResponse.data.success){
            setMyClients(myClientResponse.data.myClients);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  
  const getActivityLog = async (userID) => {
    axios.post(SERVER_URL + 'getUserActivityLogProfessional', {
      userID: userID,
    }).then((response) => {
        console.log(response.data.activityLog);
        setClientActivity(response.data.activityLog);
    });
    

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
      <NavBar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-2 p-0">
            <LeftNav />
          </div>

          <div className="col-10 mt-5">
            <h2>Your Clients</h2>
            <br />
            
            <table className="table">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Client Name</th>
                    <th scope="col">Client Mail ID</th>
                    <th scope="col">Doctor Name</th>
                    <th scope="col">Doctor Mail ID</th>
                    <th scope="col">Handling Since</th>
                    </tr>
                </thead>
                <tbody>
                    {myClients.map((item, index) => (
                    <tr key={item._id}>
                        <th scope="row">{index + 1}</th>
                        <td><a href="javascript:void(0)" style={{color: 'black'}} onClick={() => handleUserDetailClick(item)}>{item.clientName}</a></td>
                        <td>{item.clientMailID}</td>
                        <td>{item.doctorName}</td>
                        <td>{item.doctorMailID}</td>

                        <td>{item.createdAt}</td>
                    </tr>
                    ))}
                </tbody>
            </table>

          </div>
        </div>

         {/* MODEL Client activity Details View Modal */}
         <Modal show={showUserDetailModal} onHide={handleUserDeatilCloseModal} size="lg"> 
                <Modal.Header closeButton>
                    <Modal.Title>Client Details</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                  <div className="row">
                    <div className="col">
                      <strong>Client Name :</strong> <br/>{selectedClient.clientName}
                    </div>
                    <div className="col">
                      <strong>Contact Number :</strong> <br/>{selectedClient.contactNumber}
                    </div>
                  </div>
                  <br/>
                  <div className="row">
                    <div className="col">
                      <strong>Gender :</strong> <br/>{selectedClient.gender}
                    </div>
                    <div className="col">
                      <strong>Date Of Birth :</strong> <br/>{selectedClient.dateOfBirth}
                    </div>
                  </div>
                  <br/>
                  <div className="row">
                    <div className="col">
                      <strong>Health Data :</strong> <br/>{selectedClient.healthData}
                    </div>
                    <div className="col">
                      <strong>Fitness Goals :</strong> <br/>{selectedClient.fitnessGoals}
                    </div>
                  </div>
                  <br/>
                  <hr/>
                    {selectedClient && (
                    <>
                      <table className="table" height="120px" overflow="scroll"> 
                          <thead>
                              <tr>
                              <th scope="col">#</th>
                              <th scope="col">Type</th>
                              <th scope="col">Description</th>
                              <th scope="col">Value</th>
                              <th scope="col">Date</th>
                              </tr>
                          </thead>
                          <tbody>
                              {clientActivity.map((item, index) => (
                              <tr key={item._id}>
                                  <th scope="row">{index + 1}</th>
                                  <td   style={{ backgroundColor: getRowColor(item.type) }}>{item.type}</td>
                                  <td>{item.description}</td>
                                  <td>{item.value}</td>
                                  <td>{item.timestamp}</td>
                              </tr>
                              ))}
                          </tbody>
                        </table>
                    </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleUserDeatilCloseModal}>
                        Close 
                    </Button>
                </Modal.Footer>
        </Modal>


      </div>

      
    </div>
  );
};

export default MyClient;
