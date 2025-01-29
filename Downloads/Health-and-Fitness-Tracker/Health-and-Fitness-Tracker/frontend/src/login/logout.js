import  {React, useState, useEffect} from "react";
import axios from "axios";
import { Navigate } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {alterLoginState} from "./login-reducer";
import { useCookies } from "react-cookie";
import Cookies from 'js-cookie';

const Logout = () => {

    const [cookiesname, setCookieName, removeCookieName] = useCookies(['userName']);
    const [cookiestype, setCookieType, removeCookieType] = useCookies(['userType']);


    const alterLoginStateFunction = (data) => {
        dispatch(alterLoginState(data))
    }

    const dispatch = useDispatch();
    axios.get('http://localhost:4000/logout')
    .then(res => {
        window.location.reload();
        console.log(res.data)
    })
    .catch(err => {
        console.log(err)
    });

    alterLoginStateFunction({
        isLoggedIn: false,
        userName: '',
        email: '',
        type: '',
    });

    // Cookies.remove('userData')
    
    Cookies.remove('userName')
    Cookies.remove('userEmail')
    Cookies.remove('userType')
    // removeCookieName("userName", { path: "/" });
    // removeCookieType("userType", { path: "/" });
    localStorage.removeItem('loginToken');

    return (
        <Navigate to="/login" />
    );
}

export default Logout;