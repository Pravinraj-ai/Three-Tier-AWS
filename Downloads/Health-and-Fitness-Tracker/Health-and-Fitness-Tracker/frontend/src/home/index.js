import  {React, useState, useEffect} from "react";
import axios from "axios";
import {useSelector} from "react-redux";
import { useNavigate } from 'react-router-dom';

import NavBar from '../navigation-bar';
import LeftNav from '../left-navigation';
import Cookies from 'js-cookie';


const Home = () => {
    var loginState = useSelector((logAuth) => logAuth.isLoged);
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIN] = useState('');
    const loginSession = useSelector(state => state.loginstate);
    
    if(!loginSession.isLoggedIn) {
        navigate('/login');
    }
    useEffect(() => {
        axios.get('http://localhost:4000/verifyAuth')
        .then(res => {
            console.log(res.data)
            if (res.data.success) {
                loginState = true;
                const userCookieType = Cookies.get('userType');
                const userCookieEmail = Cookies.get('userEmail');
                const userCookieName = Cookies.get('userName');
               
                if(userCookieType != ''){
                    loginSession.type = userCookieType;
                    loginSession.email = userCookieEmail;
                    loginSession.userName = userCookieName;
                }
            }
          
            else {
                navigate('/login');  
            }
        })
        .catch(err => {
            console.log(err)
        });
    }, [])

    return (
        <div>
            <NavBar />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-2 p-0">
                        <LeftNav />
                    </div>
                    <div className="col-10 mt-5">
                        {loginSession.isLoggedIn ? <h3>Hi {loginSession.userName}!</h3> : <h3>Hi!</h3>}
                        <h2>Welcome to Your Fitness Tracker!</h2>  
                    </div>
            </div>
            </div>
        </div>

    );
};

export default Home