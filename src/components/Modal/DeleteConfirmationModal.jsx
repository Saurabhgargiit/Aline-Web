import React, { useState, useContext } from 'react';
import { Modal, ModalContent, ModalHeader, ModalFooter } from './Modal';

function DeleteConfirmationModal({
    modalOpen = true,
    setDeleteModalOpen,
    refetchDataFn = () => {},
    deleteUserHandlerFn,
    dataToDelete,
    setDataToDelete,
    type,
    setLoading,
}) {
    // const ctx = useContext(AddParentUserContext);

    const deleteUser = () => {
        deleteUserHandlerFn(dataToDelete);
        setDeleteModalOpen(false);
        setLoading(true);
        refetchDataFn();
        setDataToDelete();
    };
    return (
        <Modal className='add-parent-box' open={modalOpen}>
            <ModalHeader title={'Delete ' + type} />
            <ModalContent className={'mb-5'}>
                <div>Do you really want to delete this {type}?</div>
            </ModalContent>
            <ModalFooter
                onClose={() => {
                    setDeleteModalOpen(false);
                    setDataToDelete({});
                }}
                onSubmit={deleteUser}
                close={'Cancel'}
                submit={'Yes! Delete'}
            />
        </Modal>
    );
}

export default DeleteConfirmationModal;
