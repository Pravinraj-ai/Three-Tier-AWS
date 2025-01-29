import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './index.css';

const Signup = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [DOB, setDOB] = useState('');
  const [fitnessGoals, setFitnessGoals] = useState('');
  const [healthData, setHealthData] = useState('');
  const [error, setError] = useState('');

  const checkMailAvailability = (emailCheck) => {
    axios
      .post('http://localhost:4000/checkMailAvailability', { emailCheck })
      .then((res) => {
        console.log(res.data);
        if (!res.data.success) {
          setError('Email already exists.');
          setEmail('');
          return;
        } else {
          setError('');
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!userName || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    if (error !== '') {
      return;
    }

    axios
      .post('http://localhost:4000/signup', {
        userName,
        email,
        password,
        contactNumber,
        address,
        age,
        DOB,
        gender,
        fitnessGoals,
        healthData,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          console.log('Signup Successful');
          setError('');
          alert('Account creation request submitted. Please wait...');
          navigate('/')
        } else {
          alert('Signup Failed');
        }
      })
      .catch((err) => console.log(err));
  };

  const fitnessGoalsOptions = [
    'Weight Loss',
    'Bodybuilding',
    'Cardiovascular Fitness',
    'Overall Health and Wellness',
  ];

  const genderOptions = ['Woman', 'Man', 'Non-Binary', ' I prefer not to say'];

  return (
    <div className="signup-body">
      <div className="login-container">
        <div className="health-info-container">
          <img src="/logo.png" alt="User" className="imagesrc" />
          <br />
          <br />
          <h3>Welcome to,</h3>
          <h1 style={{ color: '#ddb42b' }}>HEALTH AND FITNESS TRACKER</h1>
          <p>
            "Empower Your Wellness Journey: <b>Track, Transform, Thrive!."</b>
          </p>
        </div>

        <div className="login-form-container">
          <div className="login-form">
            <h2>USER SIGNUP</h2>
            <form onSubmit={handleSignup}>
              <div className="input-container">
                <input
                  required
                  type="text"
                  placeholder="User Name"
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="input-container">
                <input
                  type="email"
                  required
                  placeholder="Email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    checkMailAvailability(e.target.value);
                  }}
                />
              </div>
              <div className="input-container">
                <input
                  required
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="input-container">
                <input
                  required
                  type="password"
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="input-container">
                <input
                  required
                  type="text"
                  placeholder="Contact Number"
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </div>
              <div className="input-container">
                <input
                  required
                  type="text"
                  placeholder="Address"
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="input-container">
                <div className="dob-label">DOB</div>
                <input required
                  type="date"

                  onChange={(e) => setDOB(e.target.value)}
                />
              </div>
              <div className="input-container">
                <input
                  required
                  type="text"
                  placeholder="Age"
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div className="input-container">
                <select required onChange={(e) => setGender(e.target.value)}>
                  <option value="" disabled selected>
                    Select Gender
                  </option>
                  {genderOptions.map((gen) => (
                    <option key={gen} value={gen}>
                      {gen}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-container">
                <select required onChange={(e) => setFitnessGoals(e.target.value)}>
                  <option value="" disabled selected>
                    Select Fitness Goal
                  </option>
                  {fitnessGoalsOptions.map((goal) => (
                    <option key={goal} value={goal}>
                      {goal}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-container">
                <input
                  required
                  type="text"
                  placeholder="Enter any medical condition else NA"
                  onChange={(e) => setHealthData(e.target.value)}
                />
              </div>

              {/* Message */}
              {error && <div className="error-message">{error}</div>}
              <button type="submit">Sign Up</button>

              <div className="create-account">
                <Link to="/login">Already have an account? Log In</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
