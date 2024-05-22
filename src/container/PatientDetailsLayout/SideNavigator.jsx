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
                    <div className='side-navigator-links'>
                        <nav>
                            <ul>
                                <li className=''>
                                    <Link
                                        to={pathNamePrefix + '/details'}
                                        onClick={() => {}}
                                        className={pathname.includes('/details') ? 'active' : ''}
                                    >
                                        Details and Photos
                                    </Link>
                                </li>
                                <li className=''>
                                    <Link
                                        to={pathNamePrefix + '/treatmentPlan'}
                                        onClick={() => {}}
                                        className={
                                            pathname.includes('/treatmentPlan') ? 'active' : ''
                                        }
                                    >
                                        Treatment Plan
                                    </Link>
                                </li>
                                <li className=''>
                                    <Link
                                        to={pathNamePrefix + '/progress'}
                                        onClick={() => {}}
                                        className={pathname.includes('/progress') ? 'active' : ''}
                                    >
                                        Treatment Progress Update
                                    </Link>
                                </li>
                                <li className=''>
                                    <Link
                                        to={pathNamePrefix + '/rebootRequested'}
                                        onClick={() => {}}
                                        className={
                                            pathname.includes('/rebootRequested') ? 'active' : ''
                                        }
                                    >
                                        Reboot Requested
                                    </Link>
                                </li>
                                <li className=''>
                                    <Link
                                        to={pathNamePrefix + '/rebootPlan'}
                                        onClick={() => {}}
                                        className={pathname.includes('/rebootPlan') ? 'active' : ''}
                                    >
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
