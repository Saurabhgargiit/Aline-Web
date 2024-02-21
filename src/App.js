import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/styles.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginForm from './container/LoginForm';
import HomeLayout from './container/Home/HomeLayout';
import { useSelector } from 'react-redux';
import PatientDetailsAddEditLayout from './container/PatientDetailsForm/PatientDetailsAddEditLayout';
import PatientDetailsLayout from './container/PatientDetails/PatientDetailsLayout';

function App() {
  const [loggedIn, setLoggedIn] = useState(true);
  return (
    <>
      {/* <PatientDetailsAddEditLayout /> */}
      <PatientDetailsLayout />
      {/* {loggedIn ? <HomeLayout /> : <LoginForm />} */}
    </>
  );
}

export default App;
