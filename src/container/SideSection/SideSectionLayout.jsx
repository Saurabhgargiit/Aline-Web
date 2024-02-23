import React from 'react';
import { Link } from 'react-router-dom';
import './SideSectionLayout.scss';

const SideSectionLayout = () => {
    return (
        <div className='side-section-modal-container'>
            <aside className='side-section-layout'>
                <div className='side-section-container'>
                    <div className='side-logo-and-web-name'>
                        <div className='side-logo'></div>
                        <div className='side-web-name'>Aline Patient Manager</div>
                    </div>
                    <nav className='side-links'>
                        <ul>
                            <li className='side-patients-link'>
                                <Link to={'/home'}>Patient Details</Link>
                            </li>
                            <li className='admin-link'>
                                <Link to={'/home'}>Admin</Link>
                            </li>
                        </ul>
                    </nav>
                    <div className='side-logout-container'>
                        <div className='side-email'>saurabhgarg.iitbhu@gmail.com</div>
                        <button className='side-logout'>Logout</button>
                    </div>
                </div>
            </aside>
            <div className='overall-modal'></div>
        </div>
    );
};

export default SideSectionLayout;
