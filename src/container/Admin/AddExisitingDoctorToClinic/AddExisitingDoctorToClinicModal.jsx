import React, { useContext } from 'react';
import { Modal, ModalContent, ModalHeader, ModalFooter } from '../../../components/Modal/Modal';
import { AddParentUserContext } from '../AddParentUser/Context/AddParentUserContext';
import AddExistingDoctorForm from './AddExistingDoctorForm';

function AddExisitingDoctorToClinicModal({}) {
    const ctx = useContext(AddParentUserContext);
    const title = `Add Exising Doctor to clinic`;
    const addExistingDoctortoClininc = () => {
        ctx.addExistingDoctortoClinincFn();
    };
    return (
        <Modal className='add-parent-box' open={ctx.isAddExistingDrClinicOpen}>
            <ModalHeader title={title} />
            <ModalContent>
                <AddExistingDoctorForm />
            </ModalContent>
            <ModalFooter
                onClose={ctx.closeModalHandler}
                onSubmit={addExistingDoctortoClininc}
                close={'Close'}
                submit={'Add Doctor'}
                disabled={ctx.loading}
            />
        </Modal>
    );
}

export default AddExisitingDoctorToClinicModal;
