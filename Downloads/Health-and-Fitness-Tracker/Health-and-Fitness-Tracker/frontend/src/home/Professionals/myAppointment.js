import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';


import NavBar from '../../navigation-bar';
import LeftNav from '../../left-navigation';


const MyAppointment = () => {

  const SERVER_URL = useSelector(state => state.generalInfo.SERVER_URL);
  const loginSession = useSelector(state => state.loginstate);

  const [selectedClient, setSelectedClient] = useState('');
  const [showUserDetailModal, setShowUserDetailModal] = useState(false);
  const [appointment, setAppointment] = useState([]);

  const handleUserDetailClick = (client) => {
    setSelectedClient(client);
    setShowUserDetailModal(true);
  };

  const handleUserDeatilCloseModal = () => {
      setShowUserDetailModal(false);
  };

  const getAppointmentData = async () =>{
    try {
        const myAppointmentResponse = await axios.post(SERVER_URL + 'getMyAppointments', {
          userType: loginSession.type,
          emailID: loginSession.email,
        });
        if (myAppointmentResponse.data.success){
            setAppointment(myAppointmentResponse.data.appointmentData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
  }

  useEffect(() => {
    const fetchData = async () => {
        getAppointmentData();
    };

    fetchData();
  }, []);
  
  const [appointmentStatus, setAppointmentStatus] = useState('');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  
  const handleRequestAppointment = async () => {
    if (!appointmentStatus) {
        alert('Please update the appointment status');
        return;
    }
    
    try {
        await axios.post(SERVER_URL + 'updateMyAppointments', {
            appointmentStatus: appointmentStatus,
            appointmentNotes: appointmentNotes,
            userType: loginSession.type,
            emailID: loginSession.email,
            appointmentID: selectedClient.appointmentID,
            appointmentReqName : selectedClient.clientName,
            appointmentReqMailID : selectedClient.clientMailID,
        })
        .then((response) => {
            console.log(response.data);
            if (response.data.success) {
                alert('Appointment updated successfully.');
                setAppointmentStatus('');
                setAppointmentNotes('') 
                getAppointmentData();
                handleUserDeatilCloseModal();
            } else {
                alert('Error updating appointment data.');
            }
        });
      } catch (error) {
        console.log(error);
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
            <h2>Your Appointments</h2>
            <br />
            
            <table className="table">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Client Name</th>
                    <th scope="col">Client Mail ID</th>
                    <th scope="col">Appointment Date</th>
                    <th scope="col">Appointment Time</th>
                    <th scope="col">Appointment Status</th>
                    </tr>
                </thead>
                <tbody>
                    {appointment.map((item, index) => (
                    <tr key={item._id}>
                        <th scope="row">{index + 1}</th>
                        <td><a href="javascript:void(0)" style={{color: 'black'}} onClick={() => handleUserDetailClick(item)}>{item.clientName}</a></td>
                        <td>{item.clientMailID}</td>
                        <td>{item.appointmentDate}</td>
                        <td>{item.appointmentTime}</td>

                        <td>{item.status}</td>
                    </tr>
                    ))}
                </tbody>
            </table>

          </div>
        </div>

         {/* MODEL Client activity Details View Modal */}
         <Modal show={showUserDetailModal} onHide={handleUserDeatilCloseModal}> 
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
                  <p><b>Current Status :</b> {selectedClient.status}</p>
                  <div className="row">
                    <div className="col">
                      <strong>Appointment Notes :</strong> <br/><br/>
                      <textarea className="form-control" rows="5" id="comment" value={appointmentNotes} onChange={(e) => setAppointmentNotes(e.target.value)}></textarea>
                    </div>
                    <div className="col">
                      <strong>Appointment Status :</strong> <br/><br/>
                      <select className="form-control" value={appointmentStatus} onChange={(e) => setAppointmentStatus(e.target.value)}>
                        <option value="" default selected="selected">Select the status</option>
                        <option value="Canceled">Canceled</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Completed">Completed</option>
                        </select>
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => handleRequestAppointment()}>
                        Update 
                    </Button>
                    <Button variant="secondary" onClick={handleUserDeatilCloseModal}>
                        Close 
                    </Button>
                </Modal.Footer>
        </Modal>


      </div>

      
    </div>
  );
};

export default MyAppointment;
