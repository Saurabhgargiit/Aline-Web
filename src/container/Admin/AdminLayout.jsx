import React, { useState } from 'react';
import UserList from './UserList';
import { Modal, ModalContent, ModalHeader, ModalFooter } from '../../components/Modal/Modal';
import AddClinic from './AddClinic';
import './AddClinic.scss';

const AdminLayout = () => {
    const [open, setOpen] = useState(false);
    const addClinicHandler = () => {
        setOpen((prevState) => !prevState);
    };
    const closeModalHandler = () => {
        setOpen((prevState) => !prevState);
    };

    const createUserHandler = () => {};
    return (
        <div className='top-bottom-position-container'>
            <button onClick={addClinicHandler}>Add Clinic</button>
            <UserList />
            <Modal className='add-clinic-box' open={open}>
                <ModalHeader title={'Add/Edit Clinic'} />
                <ModalContent>
                    <AddClinic />
                </ModalContent>
                <ModalFooter
                    onClose={closeModalHandler}
                    onSubmit={createUserHandler}
                    close={'Close'}
                    submit={'Create'}
                />
            </Modal>
        </div>
    );
};

export default AdminLayout;
