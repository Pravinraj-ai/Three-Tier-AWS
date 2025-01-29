import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Button, Form } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';


import axios from 'axios';

import NavBar from '../../navigation-bar';
import LeftNav from '../../left-navigation';

import ExportExcel from '../../exportExcel/exportData.js';

const localizer = momentLocalizer(moment);

const UserAppointments = () => {

  const SERVER_URL = useSelector(state => state.generalInfo.SERVER_URL);
  const loginSession = useSelector(state => state.loginstate);

  
  const [pastAppointments, setPastAppointments] = useState([]);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      title: 'Doctor Consultation',
      date: new Date(2023, 11, 18, 10, 0), // month is 0-based
      duration: 60, // in minutes
      type: 'doctor',
      assignedProfessional: 'Dr. Smith',
    },
    {
      id: 2,
      title: 'Trainer Session',
      date: new Date(2023, 11, 19, 14, 0),
      duration: 60,
      type: 'trainer',
      assignedProfessional: 'John Doe',
    },
    {
      id: 3,
      title: 'Trainer Session',
      date: new Date(2023, 11, 20, 14, 0),
      duration: 60,
      type: 'trainer',
      assignedProfessional: 'John Due',
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.post(SERVER_URL + 'getUserAppointments', {emailID : loginSession.email})
        .then((response) => {
            if (response.data.success) {
              setAppointments(response.data.appointments);
                // setLogs(response.data.log);
            } else {
                console.error('Error updating user access');
            }
        })

        await axios.post(SERVER_URL + 'getPastUserAppointments', {emailID : loginSession.email})
        .then((response) => {
            if (response.data.success) {
              setPastAppointments(response.data.appointments);
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


  const [selectedDate, setSelectedDate] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [currentView, setCurrentView] = useState('month');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [BookErrorMessage, setBookErrorMessage] = useState('');

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setShowAppointmentModal(true);
    setSelectedTime('');
    setSelectedProfessional(''); 
    setBookErrorMessage('');
    
  };

  const handleAppointmentCloseModal = () => {
    setShowAppointmentModal(false);
    setSelectedAppointment(null); 
  };

  const handleBookAppointment = async () => {
    
    if (selectedTime === '' || selectedProfessional === '') {
      setBookErrorMessage('Please select a time and professional');    
    }
    
    try {
      await axios.post(SERVER_URL + 'bookAppointment', {
        emailID: loginSession.email,
        date: selectedDate,
        time: selectedTime,
        professional: selectedProfessional,
      })
      .then((response) => {
          if (response.data.success) {
            alert('Booked appointment successfully.')
            setAppointments(response.data.appointments);
            handleAppointmentCloseModal();
              // setLogs(response.data.log);
          } else {
              console.error('Error booking appointment.');
          }
      })
    } catch (error) {
      alert('Error booking appointment')
    }
  };

  const handleCancelAppointment = () => {
    axios.post(SERVER_URL + 'cancelAppointment', {
      appointmentID : selectedAppointment.appointmentID,
      emailID: loginSession.email,
    }).then((response) => {
      if (response.data.success) {
        alert('Appointment canceled successfully.')
        setAppointments(response.data.appointments);
        handleAppointmentCloseModal();
      } else {
          console.error('Error canceling appointment.');
      }
    });

    // // Update appointments by removing the canceled appointment
    // const updatedAppointments = appointments.filter((appointment) => appointment.id !== selectedAppointment.id);
    // setAppointments(updatedAppointments);

    setSelectedAppointment(null);
    handleAppointmentCloseModal();
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleSelectEvent = (event) => {
    setSelectedAppointment(event);
    setShowAppointmentModal(true);
  };

  const renderDetailedView = () => {
    if (currentView === 'week' || currentView === 'day') {
      return (
        <div>
          {/* Add your detailed view components here */}
          {/*<h3>Detailed View for {currentView}</h3>*/}
          {/* You can customize this section based on your requirements */}
        </div>
      );
    }
    return null;
  };

  const renderCancelRescheduleButtons = () => {
    const today = moment();
    const appointmentDate = selectedAppointment?.date ? moment(selectedAppointment.date) : null;

    if (appointmentDate && appointmentDate.isSameOrAfter(today, 'day')) {
      return (
        <div>
          <Button variant="danger" onClick={handleCancelAppointment}>
            Cancel Appointment
          </Button>
        </div>
      );
    }

    return null;
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
            <h2>Your Appointments</h2>
            <Calendar
              localizer={localizer}
              events={appointments}
              startAccessor="date"
              endAccessor={(event) => moment(event.date).add(event.duration, 'minutes').toDate()}
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              style={{ height: 500 }}
              onView={handleViewChange}
              views={['month', 'agenda']}
            />

            {renderDetailedView()}


            <br/>
            <h2>Past Appointments</h2>
            <br />
            <ExportExcel data={appointments} fileName={"appointmentsHistory"} />
            <table className="table" overflow="scroll" maxHeight="500px">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">Professional</th>
                    <th scope="col">Professional Name</th>
                    <th scope="col">Notes</th>
                    <th scope="col">Status</th>
                    
                    </tr>
                </thead>
                <tbody>
                    {pastAppointments.map((item, index) => (
                    <tr key={item._id}>
                        <th scope="row">{index + 1}</th>
                        {/* <td><a href="javascript:void(0)" style={{color: 'black'}} onClick={() => handleUserDetailClick(item)}>{item.userName}</a></td> */}
                        <td>{item.appointmentDate}</td>
                        <td>{item.appointmentTime}</td>
                        <td>{item.type}</td>
                        <td>{item.assignedProfessional}</td>
                        <td>{item.notes}</td>
                        {
                          item.status === 'Canceled' ? <td style={{color: 'red'}}>{item.status}</td> : <></>
                        }
                        {
                          item.status === 'Booked' ? <td style={{color: 'black'}}>{item.status}</td> : <></>
                        }
                        {
                          item.status === 'Completed' ? <td style={{color: 'green'}}>{item.status}</td> : <></>
                        }
                        {
                          item.status === 'Accepted' ? <td style={{color: 'blue'}}>{item.status}</td> : <></>
                        }            
                    </tr>
                    ))}
                </tbody>
            </table>
            <br/>
            <br/>
          </div>
        </div>
      </div>

      




      <Modal show={showAppointmentModal} onHide={handleAppointmentCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedAppointment ? 'Appointment Details' : 'Book Appointment'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment ? (
            <div>
              <p>
                <strong>{selectedAppointment.title}</strong>
              </p>
              <p>Date: {moment(selectedAppointment.date).format('MMMM DD, YYYY')}</p>
              <p>
                Time: {moment(selectedAppointment.date).format('hh:mm A')} -{' '}
                {moment(selectedAppointment.date)
                  .add(selectedAppointment.duration, 'minutes')
                  .format('hh:mm A')}
              </p>
              <p>Assigned Professional: {selectedAppointment.assignedProfessional}</p>
              {renderCancelRescheduleButtons()}
            </div>
          ) : (
            <Form>
              <Form.Group controlId="formTime">
                <Form.Label><b>Time</b></Form.Label>
                <Form.Control
                  as="select"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  <option value="" disabled selected required>
                    Select Time
                  </option>
                  <option value="09:00 - 10:00 AM">09:00 - 10:00 AM</option>
                  <option value="10:00 - 11:00 AM">10:00 - 11:00 AM</option>
                  <option value="11:00 - 12:00 AM">11:00 - 12:00 AM</option>
                  
                  <option value="13:00 - 14:00 PM">13:00 - 14:00 PM</option>
                  <option value="14:00 - 15:00 PM">14:00 - 15:00 PM</option>
                  <option value="15:00 - 16:00 PM">15:00 - 16:00 PM</option>
                </Form.Control>
              </Form.Group><br/>
              <Form.Group controlId="formProfessional">
                <Form.Label><b>Appointment with</b></Form.Label>
                <Form.Control
                  as="select"
                  value={selectedProfessional}
                  onChange={(e) => setSelectedProfessional(e.target.value)}
                >
                  <option value="" disabled selected required>
                    Select Professional
                  </option>
                  <option value="Doctor">Doctor</option>
                  <option value="Trainer">Trainer</option>
                </Form.Control>
              </Form.Group>
              <br/>
              <span style={{color: 'red'}}>{BookErrorMessage}</span>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAppointmentCloseModal}>
            Close
          </Button>
          {!selectedAppointment && (
            <Button variant="primary" onClick={handleBookAppointment}>
              Book Appointment
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserAppointments;
