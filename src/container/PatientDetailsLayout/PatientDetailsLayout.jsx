import React from 'react';
import './PatientDetailsLayout.scss';
import SideNavigator from './SideNavigator';
import PatientInfoCenter from './PatientInfoCenter';

//its HOC for details layout containing mid section, left section and right section

function PatientDetailsLayout(Component) {
    const ComponentWithSections = (props) => {
        return (
            <div className='patientDetailsLayout'>
                {/* Left side Component : Navigator */}
                <SideNavigator />
                {/* middle component */}
                <Component {...props} />
                {/* <div>Right Side Section</div> */}
                <PatientInfoCenter />
            </div>
        );
    };
    return ComponentWithSections;
}

export default PatientDetailsLayout;
