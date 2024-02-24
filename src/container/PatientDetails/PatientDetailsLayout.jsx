import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import PatientDetailsContainer from './PatientDetailsContainer';
import './PatientDetailsLayout.scss';

function PatientDetailsLayout() {
    return (
        <>
            <div className='patientDetailsLayout'>
                <PatientDetailsContainer />
            </div>
        </>
    );
}

export default PatientDetailsLayout;
