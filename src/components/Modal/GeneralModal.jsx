import React, { useState, useRef } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from '../../components/Modal/Modal';

function GeneralModal({
  isOpen,
  title,
  closeHanlder,
  type,
  initialData,
  setUserAdded,
  saveHandler =() =>{},
  content
}) {
  const formRef = useRef(null);
  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.submitForm(); // Invoke the child component's method directly
    }
    saveHandler(type);
    // saveHandler();
  };

  return (
    <Modal className="add-parent-box" open={isOpen}>
      <ModalHeader title={title} />
      <ModalContent className={'mb-5'}>
        {content}
      </ModalContent>
      <ModalFooter
        onClose={closeHanlder}
        onSubmit={handleSubmit}
        close={'Cancel'}
        submit={title}
        // disabled={ctx.loading}
      />
    </Modal>
  );
}

export default GeneralModal;
