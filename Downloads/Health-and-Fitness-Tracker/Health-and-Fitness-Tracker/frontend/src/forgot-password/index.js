import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './index.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [userType, setUserType] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter your email.');
      return;
    }

    setMessage('');
    axios.post('http://localhost:4000/forgotpassword', {email: email, userType: userType})
        .then(res => {
            if (res.data.success) {
                setMessage('Your password is sent to your email.');               
            } else {
                setMessage('Invalid Email ID.');
            }
        })
        .catch(err => console.log(err))
  }

  return (
    <div className="forgot-password-body">
      <div className="forgot-password-container">
        <div className="health-info-container">
            <img src="/logo.png" alt="User" className="imagesrc" />
            <br />
            <br />
            <h3>Welcome to,</h3>
            <h1 style={{ color: '#ddb42b' }}>HEALTH AND FITNESS TRACKER</h1>
            <p>"Empower Your Wellness Journey: <b>Track, Transform, Thrive!."</b></p>
        </div>


        <div className="forgot-password-form-container">
            <div className="forgot-password-form">
              <h2>FORGOT PASSWORD</h2>
              <br/>
              <form onSubmit={handleForgotPassword}>
                <div className="input-container">
                    <select required onChange={(e) => setUserType(e.target.value)}>
                      <option value="" selected disabled>Select User Type</option>
                      <option value="user">User</option>
                      <option value="doctor">Doctor</option>
                      <option value="trainer">Trainer</option>
                      <option value="admin">Admin</option>
                    </select>
                </div>

                <div className="input-container">
                  <input required
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Message */}
                {message && <div className="error-message">{message}</div>}

                <button type="submit">Submit</button>
                <hr />
                <div>
                  <Link to="/login">Back to Login</Link>
                </div>
              </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
