import React from 'react';
import './PatientDetailsLayout.scss';

function PatientDetailsLayout(Component) {
    const ComponentWithSections = (props) => {
        return (
            <div className='patientDetailsLayout'>
                <div>Left Side Section</div>
                <Component {...props} />
                <div>Right Side Section</div>
            </div>
        );
    };
    return ComponentWithSections;
}

export default PatientDetailsLayout;
