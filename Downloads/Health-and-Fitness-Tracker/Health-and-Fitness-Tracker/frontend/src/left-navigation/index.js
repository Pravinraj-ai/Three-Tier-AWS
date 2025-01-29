import React from 'react';
import { Link } from 'react-router-dom';
import {useSelector} from "react-redux";

import "./index.css"
import Cookies from 'js-cookie';

const LeftNav = () => {
  const listItemStyle = {
    borderBottom: '1px solid grey',
    padding: '10px',
  };

  const loginSession = useSelector(state => state.loginstate);
  // const [userCookies, setUserCookies] = useState({
  //   userMail : '',
  //   userType : '',
  //   userName : '',
  // });

  // setCookieUserName("userName", res.data.userName, { path: "/" });
  // setCookieUserType("userType", userType, { path: "/" });

  // console.log(userCookies);
  // alert(userCookies.userName)
  
  return (
    <div className="col-8 p-0 bg-dark" style={{position:"relative", height: '100%', border: '1px solid grey' }}>
      <ul className="nav flex-column text-white">
        <li className="nav-item" style={listItemStyle}>
          <Link className="nav-link text-white">Home</Link>
        </li>

        {/* User Tabs */}

        {/* {loginSession.type === 'user' ?
          <li className="nav-item" style={listItemStyle}>
            <Link className="nav-link text-white" to="/goals">Fitness Goals</Link>
          </li>
        : '' } */}

        {loginSession.type === 'user' ?
          <li className="nav-item" style={listItemStyle}>
            <Link className="nav-link text-white" to="/goals">Goal Blog</Link>
          </li>
         : '' }

        {loginSession.type === 'user' ?
          <li className="nav-item" style={listItemStyle}>
            <Link className="nav-link text-white" to="/log">Daily Log</Link>
          </li>
         : '' }
        {loginSession.type === 'user' ?
          <li className="nav-item" style={listItemStyle}>
            <Link className="nav-link text-white" to="/appointments">Appointments</Link>
          </li>
        : '' }


         {/* Admin Tabs */}
         {loginSession.type === 'admin' ?
          <li className="nav-item" style={listItemStyle}>
            <Link className="nav-link text-white" to="/client">Clients</Link>
          </li>
        : '' }

        {loginSession.type === 'admin' ?
          <li className="nav-item" style={listItemStyle}>
            <Link className="nav-link text-white" to="/doctor">Doctors</Link>
          </li>
        : '' }

        {loginSession.type === 'admin' ?
          <li className="nav-item" style={listItemStyle}>
            <Link className="nav-link text-white" to="/trainer">Trainers</Link>
          </li>
        : '' }

        {loginSession.type === 'admin' ?
          <li className="nav-item" style={listItemStyle}>
            <Link className="nav-link text-white" to="/records">Records</Link>
          </li>
        : '' }


         {/* Professionals Tabs */}
         {loginSession.type === 'doctor' || loginSession.type === 'trainer'?
          <li className="nav-item" style={listItemStyle}>
            <Link className="nav-link text-white" to="/myClients">My Clients</Link>
          </li>
        : '' }

        {loginSession.type === 'doctor' || loginSession.type === 'trainer'?
          <li className="nav-item" style={listItemStyle}>
            <Link className="nav-link text-white" to="/myAppointments">My Appointments</Link>
          </li>
        : '' }

      </ul>
    </div>
  );
};

export default LeftNav;
