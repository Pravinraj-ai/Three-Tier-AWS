// Profile.js

import React, { useState, useEffect } from 'react';
import {useSelector} from "react-redux";
import NavBar from '../navigation-bar';
import LeftNav from '../left-navigation';
import axios from 'axios';

const Profile = () => {
  const initialProfileData = {
    userName: 'JohnDoe',
    email: 'johndoe@example.com',
    contactNumber: '1234567890',
    address: '123 Street, City',
    age: '30',
    gender: 'Male',
    fitnessGoals: 'Lose Weight',
    healthData: 'Normal',
  };

  const [profileData, setProfileData] = useState(initialProfileData);
  const [profileViewData, setProfileViewData] = useState([]);
  
  const [editedData, setEditedData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  
  const loginSession = useSelector(state => state.loginstate);
  const SERVER_URL = useSelector(state => state.generalInfo.SERVER_URL);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.post(SERVER_URL + 'getProfileDetails', {emailID : loginSession.email})
        .then((response) => {
            if (response.data.success) {
              setProfileViewData(response.data.profile);
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

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleEdit = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const saveChanges = () => {
    setProfileData({ ...profileData, ...editedData });
    setEditedData({});
    setIsEditing(false);
    // You can also send the editedData to the server for persistence
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    axios.post(SERVER_URL +'changePassword', {
      userType: loginSession.type,
      mailID: loginSession.email,
      userName: loginSession.userName,
      newPassword: passwordData.newPassword,
      currentPassword: passwordData.currentPassword,
    })
    .then((response) => {
        if (response.data.success) {
            alert("Password changed successfully");
            setPasswordData({
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            });
            setErrorMessage('');
        } else if (response.data.message) {
            setErrorMessage(response.data.message);
        } else {
            alert('Error updating password');
        }
    })
    
  };

  return (
    <div>
      {/* Top Navigation Bar */}
      <NavBar />

      <div className="container-fluid">
        <div className="row">
          {/* Left Navigation Bar */}
          <div className="col-md-2 p-0">
            <LeftNav />
          </div>
          
          
         
          <div className="col-md-10 mt-5">
                    {/* <h2>Profile Details</h2>
                    <form>
                      {Object.entries(profileData).map(([field, value]) => (
                        <div className="input-container" key={field}>
                          <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                          <input
                            type="text"
                            value={isEditing ? editedData[field] || value : value}
                            onChange={(e) => isEditing && handleEdit(field, e.target.value)}
                            readOnly={!isEditing}
                          />
                        </div>
                      ))}

                    
                      {isEditing ? (
                        <>
                          <button type="button" className="btn btn-primary" onClick={saveChanges}>
                            Save Changes
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => setIsEditing(true)}
                        >
                          Edit
                        </button>
                      )}
                    </form> */}
                  

            <div className="mt-5">
              <h2>Account Details</h2>
              <hr/>
              <b>User Name :</b> {loginSession.userName} 
              <br/>
              <b>Mail ID :</b> {loginSession.email}
              <br/>
              <b>Role :</b> {loginSession.type}
              <br/><br/>
              { loginSession.type === 'user' &&
  
              <>
                <h2>Professionals Assigned Details</h2>
                <hr/>
                
                <div className="row">
                  <div className="col">
                  <b>Doctor Name :</b> {profileViewData.doctorName} 
                  </div>
                  <div className="col">
                  <b>Trainer Name :</b> {profileViewData.trainerName} 
                  </div>
                </div>
                <br/>
                <div className="row">
                  <div className="col">
                  <b>Doctor Mail :</b> {profileViewData.doctorMail} 
                  </div>
                  <div className="col">
                  <b>Trainer Mail :</b> {profileViewData.trainerMail} 
                  </div>
                </div>
                <br/>
                <div className="row">
                  <div className="col">
                  <b>Doctor Contact Number :</b> {profileViewData.doctorNumber} 
                  </div>
                  <div className="col">
                  <b>Trainer Contact Number :</b> {profileViewData.trainerNumber} 
                  </div>
                </div>
                <br/>
                <div className="row">
                  <div className="col">
                  <b>Doctor Qualification :</b> {profileViewData.doctorQualification} 
                  </div>
                  <div className="col">
                  <b>Trainer Qualification :</b> {profileViewData.trainerQualification} 
                  </div>
                </div>
                <br/>
                <div className="row">
                  <div className="col">
                  <b>Doctor Specialization :</b> {profileViewData.doctorSpecialization} 
                  </div>
                  <div className="col">
                  <b>Trainer Specialization :</b> {profileViewData.trainerSpecialization} 
                  </div>
                </div>
        
        
                <br/><br/>
              </>
              
              }
              <h2>Change Password</h2>
              <hr/>

              <form>
                <div className="input-container">
                  <label><b>Current Password</b></label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                  />
                </div>

                <div className="input-container">
                  <label><b>New Password</b></label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                  />
                </div>

                <div className="input-container">
                  <label><b>Confirm Password</b></label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                  />
                </div>
                <br/>
                <span style={{color:"red"}}> {errorMessage}</span> 
                <br/><br/>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleChangePassword}
                >
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
};

export default Profile;
