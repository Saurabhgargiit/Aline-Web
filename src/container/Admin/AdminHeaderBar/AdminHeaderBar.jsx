import React, { useContext } from 'react';
import Button from '../../../components/Button/Button';
import { AddClinicContext } from '../AddClinic/Context/AddClinicContext';

const AdminHeaderBar = ({}) => {
    const { addClinicModalHandler } = useContext(AddClinicContext);
    return (
        <div>
            <Button title={'Add Clinic'} onClickCallBk={addClinicModalHandler} />
        </div>
    );
};

export default AdminHeaderBar;
