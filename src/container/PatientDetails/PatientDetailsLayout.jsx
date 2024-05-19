import React from 'react';
import './PatientDetailsLayout.scss';

//its HOC for details layout containing mid section, left section and right section

function PatientDetailsLayout(Component) {
    const ComponentWithSections = (props) => {
        return (
            <div className='patientDetailsLayout'>
                {/* <div>Left Side Section</div> */}
                <Component {...props} />
                {/* <div>Right Side Section</div> */}
            </div>
        );
    };
    return ComponentWithSections;
}

export default PatientDetailsLayout;
