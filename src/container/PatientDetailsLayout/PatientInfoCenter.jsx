import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import './PatientInfoCenter.scss';
import Button from '../../components/Button/Button';
import { CommonUtils } from '../../utils/commonfunctions/commonfunctions';

const PatientInfoCenter = ({}) => {
    return (
        <div className='displayFlex'>
            <aside className='right-section-layout'>
                <div className='right-section-container'>
                    <div className='side-logo-and-web-name'>
                        {/* <div className='side-logo'></div> */}
                        <div className='side-web-name'>Aline Patient Manager</div>
                    </div>
                    <div className='side-links'>
                        <nav>
                            <ul>
                                <li className='side-patients-link'>
                                    <Link to={'/home'} onClick={() => {}}>
                                        Patient Details
                                    </Link>
                                </li>
                                <li className='admin-link'>
                                    <Link to={'/users'} onClick={() => {}}>
                                        Admin
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className='side-logout-container'>
                        <div className='side-email'>{'email'}</div>
                        <Button
                            onClickCallBk={CommonUtils.logout.bind(CommonUtils)}
                            title={'Logout'}
                            type='primary'
                        />
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default memo(PatientInfoCenter);
