import React from 'react';
import { Outlet } from 'react-router-dom';

import SideNavigator from './SideNavigator';
import PatientInfoCenter from './PatientInfoCenter';

import './PatientDetailsLayout.scss';

//Component for nested routes

function PatientDetailsLayout() {
    return (
        <div className='patientDetailsLayout'>
            {/* Left side Component : Navigator */}
            <SideNavigator />
            {/* middle component */}
            <Outlet />
            {/* <div>Right Side Section</div> */}
            <PatientInfoCenter />
        </div>
    );
}

export default PatientDetailsLayout;
