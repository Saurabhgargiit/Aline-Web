import React from 'react';
import './PatientDetailsContainer.scss';
import FormViewTabs from '../PatientDetailsForm/FormViewTabs';
import PatientDetailsLayout from './PatientDetailsLayout/PatientDetailsLayout';

const PatientDetailsContainer = () => {
    return (
        <div className='PatientDetailsContainer'>
            <div className=''>
                <FormViewTabs />
            </div>
        </div>
    );
};

export default PatientDetailsLayout(PatientDetailsContainer);
