import React from 'react';
import './PatientDetailsLayout.scss';
import SideNavigator from './SideNavigator';

//its HOC for details layout containing mid section, left section and right section

function PatientDetailsLayout(Component) {
    const ComponentWithSections = (props) => {
        return (
            <div className='patientDetailsLayout'>
                {/* Left side Component : Navigator */}
                <SideNavigator />
                <Component {...props} />
                {/* <div>Right Side Section</div> */}
            </div>
        );
    };
    return ComponentWithSections;
}

export default PatientDetailsLayout;
