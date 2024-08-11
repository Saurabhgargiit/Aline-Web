import React, { useState } from 'react';
import SVG from 'react-inlinesvg';

import Button from '../../../components/Button/Button';
import TreatmentPlanForm from './TreatmentPlanForm';
import TreatmentPlanViewTabs from './TreatmentPlanViewTabs';
import TreatmentPlanModal from './TreatmentPlanModal';

import { CommonUtils } from '../../../utils/commonfunctions/commonfunctions';
import { CommonConstants } from '../../../utils/globalConstants';

const modalInitialState = {
  isOpen: false,
  title: '',
};

const TreatmentPlanContainer = () => {
  const [isEdit, setIsEdit] = useState(false);
  const userRole = localStorage.getItem(CommonConstants.USER_ROLE);

  const [modalDetails, setModalDetails] = useState(modalInitialState);

  const reqModFn = () => {
    setModalDetails(prev => ({
      ...prev,
      isOpen: true,
      title: 'Request for Modification',
    }));
  };

  const approveHandler = () => {
    setModalDetails(prev => ({
      ...prev,
      isOpen: true,
      title: 'Approve Plan',
    }));
  };

  const closeHanlder = () => {
    setModalDetails(prev => modalInitialState);
  };

  const addOptionHandler = () => {
    setIsEdit(true);
  };

  const cancelHandler = () => {
    setIsEdit(false);
  };

  return (
    <div className="PatientDetailsContainer">
      <div className="patient-details-tabs-container">
        {isEdit ? (
          <TreatmentPlanForm cancelHandler={cancelHandler} />
        ) : (
          <TreatmentPlanViewTabs
            approveHandler={approveHandler}
            reqModFn={reqModFn}
          />
        )}
      </div>
      {!isEdit &&
        (CommonUtils.isAdmin(userRole) || CommonUtils.isLab(userRole)) && (
          <Button
            postionClass={'home-page-button-pos rightPosEdit'}
            className={'home-page-add-button'}
            svg={
              <SVG src={require(`../../../assets/icons/plus.svg`).default} />
            }
            onClickCallBk={addOptionHandler}
            tooltip={'Add Treatment Option'}
          />
        )}
      <TreatmentPlanModal {...modalDetails} closeHanlder={closeHanlder} />
    </div>
  );
};

export default TreatmentPlanContainer;
