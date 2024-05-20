import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './SideNavigator.scss';

const SideNavigator = ({ sideSectionShowHandler }) => {
    const email = localStorage.getItem('user_email');
    const { patientID } = useParams();
    const pathname = window.location.pathname;
    const pathNamePrefix = '/patientDetails/' + patientID;
    console.log(pathNamePrefix);

    return (
        <div className='displayFlex'>
            <aside className='side-navigator-layout'>
                <div className='side-navigator-container'>
                    <div className='side-links'>
                        <nav>
                            <ul>
                                <li className=''>
                                    <Link to={pathNamePrefix + '/details'} onClick={() => {}}>
                                        Details and Photos
                                    </Link>
                                </li>
                                <li className=''>
                                    <Link to={pathNamePrefix + '/treatmentPlan'} onClick={() => {}}>
                                        Treatment Plan
                                    </Link>
                                </li>
                                <li className=''>
                                    <Link to={pathNamePrefix + '/progress'} onClick={() => {}}>
                                        Treatment Progress Update
                                    </Link>
                                </li>
                                <li className=''>
                                    <Link
                                        to={pathNamePrefix + '/rebootRequested'}
                                        onClick={() => {}}
                                    >
                                        Reboot Requested
                                    </Link>
                                </li>
                                <li className=''>
                                    <Link to={pathNamePrefix + '/rebootPlan'} onClick={() => {}}>
                                        Reboot Plan Details
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default SideNavigator;
