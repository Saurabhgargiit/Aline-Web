import React from 'react';
import { Link } from 'react-router-dom';
import './SideSectionLayout.scss';
import Button from '../../components/Button/Button';
import { CommonUtils } from '../../utils/commonfunctions/commonfunctions';

const SideSectionLayout = ({ open, sideSectionShowHandler }) => {
    if (!open) return null;
    return (
        <div className='modal-container displayFlex'>
            <aside className='side-section-layout'>
                <div className='side-section-container'>
                    <div className='side-logo-and-web-name'>
                        <div className='side-logo'></div>
                        <div className='side-web-name'>Aline Patient Manager</div>
                    </div>
                    <nav className='side-links'>
                        <ul>
                            <li className='side-patients-link'>
                                <Link to={'/home'} onClick={() => sideSectionShowHandler()}>
                                    Patient Details
                                </Link>
                            </li>
                            <li className='admin-link'>
                                <Link to={'/users'} onClick={() => sideSectionShowHandler()}>
                                    Admin
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <div className='side-logout-container'>
                        <div className='side-email'>saurabhgarg.iitbhu@gmail.com</div>
                        <Button
                            onClickCallBk={CommonUtils.logout.bind(CommonUtils)}
                            title={'Logout'}
                        />
                    </div>
                </div>
            </aside>
            <div className='overall-modal'></div>
        </div>
    );
};

export default SideSectionLayout;
