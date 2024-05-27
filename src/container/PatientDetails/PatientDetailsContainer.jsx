import React from 'react';
import './PatientDetailsContainer.scss';
import FormViewTabs from './PatientDetailsForm/FormViewTabs';

const PatientDetailsContainer = () => {
    return (
        <div className='PatientDetailsContainer'>
            <div className=''>
                <FormViewTabs />
            </div>
        </div>
    );
};

export default PatientDetailsContainer;
