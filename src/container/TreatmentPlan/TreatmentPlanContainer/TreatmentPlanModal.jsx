import React, { useState, useRef } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from '../../../components/Modal/Modal';
import TextArea from '../../../components/TextArea/TextArea';

function TreatmentPlanModal({
  isOpen,
  title,
  closeHanlder,
  initialData,
  setUserAdded,
}) {
  const formRef = useRef(null);
  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.submitForm(); // Invoke the child component's method directly
    }
  };

  return (
    <Modal className="add-parent-box" open={isOpen}>
      <ModalHeader title={title} />
      <ModalContent>
        <TextArea
          posClassName={`patient-detials-input-fields`}
          key={'treatmentPlan'}
          label={'Comments'}
          id={'treatmentPlan'}
          placeholder={'Add comments here'}
          //   value={}
          onChangeCallBack={e => {}}
        />
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
