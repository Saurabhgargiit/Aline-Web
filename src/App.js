import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import './styles/styles.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginForm from './container/LoginForm';
import HomeLayout from './container/Home/HomeLayout';
import { useSelector } from 'react-redux';
import PatientDetailsAddEditLayout from './container/PatientDetailsForm/PatientDetailsAddEditLayout';
import PatientDetailsLayout from './container/PatientDetails/PatientDetailsLayout';
import Loader from './container/common/Loader/Loader';
import SiteLayout from './container/SiteLayout/SiteLayout';

function App() {
    const [loggedIn, setLoggedIn] = useState(true);
    return (
        <>
            <BrowserRouter>
                {/* <PatientDetailsAddEditLayout /> */}
                {/* <PatientDetailsLayout /> */}
                {/* <Loader /> */}
                {/* <HomeLayout /> */}
                {loggedIn ? <SiteLayout /> : <LoginForm />}
                {/* <SideSectionLayout /> */}
            </BrowserRouter>
        </>
    );
}

export default App;
