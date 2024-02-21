import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import PatientDetailsContainer from './PatientDetailsContainer';
import './PatientDetailsLayout.scss';

function PatientDetailsLayout() {
  return (
    <>
      <Header title={'Patient Details'} />
      <div className='patientDetailsLayout'>
        <PatientDetailsContainer />
      </div>
      <Footer />
    </>
  );
}

export default PatientDetailsLayout;
