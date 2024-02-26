import React, { useContext, useState } from 'react';
import Button from '../../../components/Button/Button';
import { AddClinicContext } from '../AddClinic/Context/AddClinicContext';
import Dropdown from '../../../components/Dropdown/Dropdown';
import './AdminHeaderBar.scss';

const filterUsertypes = [
    { key: 'doctor', value: 'doctor', label: 'Doctor List' },
    { key: 'clinic', value: 'clinic', label: 'Clinic List' },
    { key: 'lab', value: 'lab', label: 'Lab List' },
    { key: 'admin', value: 'admin', label: 'Admin List' },
];

const AdminHeaderBar = ({}) => {
    const [userTypeFilter, setUserTypeFilter] = useState();
    const { addClinicModalHandler } = useContext(AddClinicContext);
    const userTypeSelectHandler = (e) => {
        console.log(e);
        console.log(e.target.value);
    };
    return (
        <div className='displayFlex admin-header-bar-container py-2'>
            <Button
                title={'Add Clinic'}
                onClickCallBk={addClinicModalHandler}
                postionClass={'noDisplay'}
            />
            <Dropdown options={filterUsertypes} onChangeCallBk={userTypeSelectHandler} />
        </div>
    );
};

export default AdminHeaderBar;
