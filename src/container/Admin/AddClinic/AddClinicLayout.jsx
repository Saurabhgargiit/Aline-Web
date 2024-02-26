import React, { useState, useContext } from 'react';
import { Modal, ModalContent, ModalHeader, ModalFooter } from '../../../components/Modal/Modal';
import AddClinic from './AddClinic';
import './AddClinic.scss';
import { AddClinicContext } from './Context/AddClinicContext';

function AddClinicLayout() {
    const ctx = useContext(AddClinicContext);

    const createUserHandler = () => {};
    return (
        <Modal className='add-clinic-box' open={ctx.open}>
            <ModalHeader title={'Add/Edit Clinic'} />
            <ModalContent>
                <AddClinic />
            </ModalContent>
            <ModalFooter
                onClose={ctx.closeModalHandler}
                onSubmit={createUserHandler}
                close={'Close'}
                submit={'Create'}
            />
        </Modal>
    );
}

export default AddClinicLayout;
