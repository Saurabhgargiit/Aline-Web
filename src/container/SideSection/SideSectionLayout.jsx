import React from 'react';
import './SideSectionLayout.scss';

function SideSectionLayout() {
    return (
        <aside className='side-section-layout'>
            <div className='side-section-container'>
                <div className='side-logo-and-web-name'>
                    <div className='side-logo'></div>
                    <div className='side-web-name'>Aline Patient Manager</div>
                </div>
                <nav className='side-links'>
                    <ul>
                        <li className='side-patients-link'>Patient Details</li>
                        <li className='admin-link'>Admin</li>
                    </ul>
                </nav>
                <div className='side-logout-container'>
                    <div className='side-email'>saurabhgarg.iitbhu@gmail.com</div>
                    <button className='side-logout'>Logout</button>
                </div>
            </div>
        </aside>
    );
}

export default SideSectionLayout;
