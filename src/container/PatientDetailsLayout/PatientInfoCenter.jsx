import React from 'react';
import './PatientInfoCenter.scss';

const PatientInfoCenter = ({}) => {
    const infoObj = {
        patientDetails: 'Saurabh Garg',
        doctorDetails: 'Yash Gupta',
        clinicDetails: 'Saurabh Garg Clinic private Limited',
    };

    const img = 'https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg';

    return (
        <div className='displayFlex'>
            <aside className='right-section-layout'>
                <div className='right-section-container'>
                    <div className='right-profile-photo'>
                        <div className='img-container'>
                            <img
                                src={
                                    img ??
                                    'https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg'
                                }
                                alt={'Patient Photo'}
                            ></img>
                        </div>
                        {/* <div className='side-logo'></div> */}
                        <div className='side-web-name'></div>
                    </div>
                    <div className='details-container'>
                        {Object.entries({
                            patient: 'Patient',
                            doctor: 'Doctor',
                            clinic: 'Clinic',
                        }).map(([key, label]) => {
                            return (
                                <div className='info-div'>
                                    <span className='info-heading'>{label + ':'}</span>
                                    <span className='info-detail'>{infoObj[key + 'Details']}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default PatientInfoCenter;
