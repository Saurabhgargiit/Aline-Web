import React, { useContext, useState } from 'react';
import Button from '../../../components/Button/Button';
import { AddParentUserContext } from '../AddParentUser/Context/AddParentUserContext';
import Dropdown from '../../../components/Dropdown/Dropdown';
import './AdminHeaderBar.scss';
import { CommonUtils } from '../../../utils/commonfunctions/commonfunctions';

const filterUsertypes = [
    { key: 'ROLE_DOCTOR', value: 'doctor', label: 'Doctor List' },
    { key: 'ROLE_CLINIC', value: 'clinic', label: 'Clinic List' },
    { key: 'ROLE_LAB', value: 'lab', label: 'Lab List' },
    { key: 'ROLE_ADMIN', value: 'admin', label: 'Admin List' },
];

const AdminHeaderBar = ({ role, userId }) => {
    const [userTypeFilter, setUserTypeFilter] = useState();

    const { addParentUserModalHandler } = useContext(AddParentUserContext);

    const isAdmin = CommonUtils.isAdmin(role);
    const isLab = CommonUtils.isLab(role);
    const isClinic = CommonUtils.isClinic(role);
    const isDoctor = CommonUtils.isDoctor(role);

    const userTypeSelectHandler = (e) => {
        console.log(e);
        console.log(e.target.value);
    };

    return (
        <div className='header-container'>
            <div className='displayFlex admin-header-bar-container py-2'>
                {isAdmin && (
                    <Button
                        title={'Add Admin'}
                        onClickCallBk={() => addParentUserModalHandler('Admin')}
                        // postionClass={role === 'ROLE_ADMIN' ? '' : 'noDisplay'}
                    />
                )}
                {isAdmin && (
                    <Button
                        title={'Add Lab'}
                        onClickCallBk={() => addParentUserModalHandler('Lab')}
                        // postionClass={role === 'ROLE_ADMIN' ? '' : 'noDisplay'}
                    />
                )}
                {(isAdmin || isLab) && (
                    <Button
                        title={'Add Clinic'}
                        onClickCallBk={() => addParentUserModalHandler('Clinic')}
                        // postionClass={role === 'ROLE_ADMIN' ? '' : 'noDisplay'}
                    />
                )}

                <Dropdown options={filterUsertypes} onChangeCallBk={userTypeSelectHandler} />
            </div>
        </div>
    );
};

export default AdminHeaderBar;
