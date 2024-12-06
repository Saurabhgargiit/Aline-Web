import React, { useState, useRef } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from '../../../components/Modal/Modal';

function TreatmentPlanModal({
  isOpen,
  title,
  msg,
  closeHanlder,
  type,
  initialData,
  setUserAdded,
  saveHandler = () => {},
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
        {/* <TextArea
          posClassName={`patient-details-input-fields`}
          key={'treatmentPlan'}
          label={'Comments'}
          id={'treatmentPlan'}
          placeholder={'Add comments here'}
          //   value={}
          onChangeCallBack={e => {}}
        /> */}
        {/* <div>Do you really want share this Plan?</div> */}
        <div>{msg}</div>
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

export default TreatmentPlanModal;
