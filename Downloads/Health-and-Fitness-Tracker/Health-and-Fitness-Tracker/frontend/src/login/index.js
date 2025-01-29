import React, {useState, useEffect} from "react";
import axios from "axios";
import {useNavigate, useLocation, Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {alterLoginState} from "./login-reducer";
import { useCookies } from "react-cookie";
import Cookies from 'js-cookie';

import "./index.css";

const Login = () => {

    // const loginSession = useSelector(state => state.loginstate);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [cookieUser, setCookieUserName] = useCookies(["userName"]);
    const [cookieUserType, setCookieUserType] = useCookies(["userType"]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [error, setError] = useState('');

    const location = useLocation();

    const alterLoginStateFunction = (data) => {
        dispatch(alterLoginState(data))
    }

    axios.defaults.withCredentials = true;
    const handleLogin = (e) => {
        e.preventDefault();
        if (!email || !password || !userType) {
            setError('Please fill in all fields');
            return;
        }
        
        axios.post('http://localhost:4000/login', {
            email: email,
            password: password,
            userType: userType,
        })
        .then(res => {
            console.log(res.data)
            if (res.data.success) {
                setEmail('');
                setPassword('');
                alterLoginStateFunction({
                    isLoggedIn: true,
                    userName: res.data.userName,
                    email: res.data.email,
                    type: res.data.type,
                });
                // setCookieUserName("userName", res.data.userName, { path: "/" });
                // setCookieUserType("userType", userType, { path: "/" });

                Cookies.set('userName', res.data.userName,  { expires: 1, path: '' })
                Cookies.set('userEmail', res.data.email,  { expires: 1, path: '' })
                Cookies.set('userType', res.data.type,  { expires: 1, path: '' })
                
                console.log("Login Successful \n", res.data.token);
                setError('');
                const from = location.state?.from || '/';
                navigate(from);
            } else {
                setError(res.data.message);
            }
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        axios.get('http://localhost:4000/verifyAuth')
        .then(res => {
            console.log(res.data)
            if (res.data.success) {
                const from = location.state?.from || '/';
                navigate(from);
            }
        })
        .catch(err => {
            console.log(err)
        });
    }, [])

    return (
        <div className="login-body">
            <div className="login-container">
                <div className="health-info-container">
                    <img src="/logo.png" alt="User" className="imagesrc" />
                    <br />
                    <br />
                    <h3>Welcome to,</h3>
                    <h1 style={{ color: '#ddb42b' }}>HEALTH AND FITNESS TRACKER</h1>
                    <p>"Empower Your Wellness Journey: <b>Track, Transform, Thrive!."</b></p>
                </div>

                <div className="login-form-container">
                <div className="login-form">
                    <h2>USER LOGIN</h2>
                    <br />
                    <form onSubmit={handleLogin}>
                    {/* User Type Dropdown */}
                    <div className="input-container">
                        <select required
                        onChange={(e) => setUserType(e.target.value)}
                        >
                        <option value="" selected disabled>Select User Type</option>
                        <option value="user">User</option>
                        <option value="doctor">Doctor</option>
                        <option value="trainer">Trainer</option>
                        <option value="admin">Admin</option>
                        </select>
                    </div>

                    {/* Mail Input */}
                    <div className="input-container">
                        <input required 
                        type="email"
                        placeholder="Email ID"
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password Input */}
                    <div className="input-container">
                        <input required
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Login Button */}
                    <button type="submit">Log In</button>

                    {/* Error Message */}
                    {error && <div className="error-message">{error}</div>}

                    {/* Forgot Password Link */}
                    <div className="forgot-password">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>

                    {/* Divider */}
                    <hr />

                    {/* Create Account Link */}
                    <div className="create-account">
                        <Link to="/signup">Create New Account</Link>
                    </div>
                    </form>
                </div>
                </div>
            </div>
        </div>
    );
  };

export default Login