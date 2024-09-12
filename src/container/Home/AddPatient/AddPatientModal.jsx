import React, { useState, useRef } from 'react';
import { Modal, ModalContent, ModalHeader, ModalFooter } from '../../../components/Modal/Modal';
import AddPatientForm from './AddPatientForm';
// import AddPatientForm from './AddParentUserForm';
// import { AddParentUserContext } from './Context/AddParentUserContext';

function AddPatientModal({ isOpen, isEdit = false, closeHanlder, initialData, setUserAdded }) {
    const formRef = useRef(null);
    const title = `${!isEdit ? 'Add Patient' : 'Edit Patient'}`;
    const handleSubmit = () => {
        if (formRef.current) {
            formRef.current.submitForm(); // Invoke the child component's method directly
        }
    };

    return (
        <Modal className='add-parent-box' open={isOpen}>
            <ModalHeader title={title} />
            <ModalContent>
                <AddPatientForm
                    isEdit={isEdit}
                    ref={formRef}
                    closeModal={closeHanlder}
                    initialData={initialData}
                    setUserAdded={setUserAdded}
                />
            </ModalContent>
            <ModalFooter
                onClose={closeHanlder}
                onSubmit={handleSubmit}
                close={'Close'}
                submit={!isEdit ? 'Create' : 'Update'}
                // disabled={ctx.loading}
            />
        </Modal>
    );
}

export default AddPatientModal;
