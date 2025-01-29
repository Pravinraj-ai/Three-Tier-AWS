import './App.css';

import { BrowserRouter, Routes, Route} from 'react-router-dom';

import Login from './login';
import Logout from './login/logout.js';
import Home from './home';
import Signup from './signup';
import ForgetPassword from './forgot-password';
import Profile from './profile';

import ClientAdmin from './home/Admin/clientPage.js';
import DoctorAdmin from './home/Admin/doctorPage.js';
import TrainerAdmin from './home/Admin/trainerPage.js';
import RecordAdmin from './home/Admin/recordPage.js';


import UserLog from './home/User/userLog.js';
import UserAppointments from './home/User/userAppointment.js';
import UserGoals from './home/User/Goals/userGoals.js'

import MyClient from './home/Professionals/myClient.js';
import MyAppointment from './home/Professionals/myAppointment.js';

import Contact from './contact';

import {configureStore} from '@reduxjs/toolkit';
import {Provider} from "react-redux";

import loginReducer from "./login/login-reducer";
import generalInfo from "./login/general-reducer";

const store = configureStore({
  reducer: {
      loginstate : loginReducer,
      generalInfo : generalInfo,
  }
});

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
      
        <Routes>
          <Route path="/" element={ <Home/> }/>
          <Route path="/login" element={<Login/>} />
          <Route path="/logout" element={<Logout/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/forgot-password" element={<ForgetPassword />} /> 
          <Route path="/contact" element={<Contact />} />
          
          <Route path="/profile" element={<Profile />} />
          <Route path="/client" element={<ClientAdmin />} /> 
          <Route path="/doctor" element={<DoctorAdmin />} />
          <Route path="/trainer" element={<TrainerAdmin />} />
          <Route path="/records" element={<RecordAdmin />} />

          <Route path="/log" element={<UserLog />} />
          <Route path="/appointments" element={<UserAppointments />} />
          <Route path="/goals" element={<UserGoals />} />


          <Route path="/myClients" element={<MyClient/>} />
          <Route path="/myAppointments" element={<MyAppointment/>} />

        </Routes>

      </BrowserRouter>
    </Provider>
  );
}

export default App;