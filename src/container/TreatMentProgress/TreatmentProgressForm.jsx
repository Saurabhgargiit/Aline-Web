import React, { useState, useEffect, memo } from 'react';
import { toast, Bounce } from 'react-toastify';

import Dropdown from '../../components/Dropdown/Dropdown';
import Loader from '../common/Loader/Loader';
import Button from '../../components/Button/Button';
import TextArea from '../../components/TextArea/TextArea';
import MultipleImagesUploader from '../../components/FileUploader/MultipleImagesUploader';

import { CommonUtils } from '../../utils/commonfunctions/commonfunctions';
import { visitTypes, alignerTracking } from './TreatmentProgressConstants';
import { postCall, putCall } from '../../utils/commonfunctions/apicallactions';

import './TreatmentProgressForm.scss';
import { useParams } from 'react-router-dom';

const TreatmentProgressForm = (props) => {
  const {
    existingData,
    cancelHandler,
    planId,
    redirectToCurrentDraft,
    redirectToLatestDraft,
    patientID,
    rebootID,
    add,
  } = props;

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { paramId } = useParams();

  const [isEdit, setIsEdit] = useState(!!add);

  const [formValues, setFormValues] = useState({
    dateofVisit:
      existingData?.dateofVisit || CommonUtils.formatDate(new Date()),
    visitName: existingData?.visitName || '',
    visitType: existingData?.visitType || 'firstVisit',
    alignerTracking: existingData?.alignerTracking || 'good',
    notesForVisit: existingData?.notesForVisit || '',
    photos: existingData?.photos || [],
  });

  const saveHandler = () => {
    const payload = { ...formValues };
    payload['patientID'] = patientID;
    payload['id'] = isEdit ? planId : null;
    payload['treatmentPlanID'] = null;
    setIsLoading(true);

    const callFn = isEdit ? putCall : postCall;
    const successMsg = isEdit
      ? 'Treatment Plan Modified.'
      : 'Treatment Plan Added.';
    const url = isEdit ? 'UPDATE_TREATMENT_PLAN' : 'CREATE_TREATMENT_PLAN';

    callFn(payload, url, [patientID, rebootID])
      .then((data) => {
        if (data.result === 'success') {
          toast.success(successMsg, {
            position: 'top-right',
            hideProgressBar: false,
            autoClose: 2000,
            closeOnClick: true,
            theme: 'light',
            transition: Bounce,
          });
          setIsLoading(false);
          isEdit ? redirectToCurrentDraft(planId) : redirectToLatestDraft();
        } else if (data.result === 'error') {
          toast.error(data.error ?? 'An error occurred', {
            position: 'top-right',
            hideProgressBar: false,
            autoClose: 2000,
            closeOnClick: true,
            theme: 'light',
            transition: Bounce,
          });
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error saving treatment plan:', error);
        toast.error('An error occurred while saving the treatment plan.', {
          position: 'top-right',
          hideProgressBar: false,
          autoClose: 2000,
          closeOnClick: true,
          theme: 'light',
          transition: Bounce,
        });
        setIsLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleFilesUpload = (fileObj) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      ...fileObj,
    }));
  };

  const openLightbox = (index) => {
    // Implement lightbox functionality if needed
  };

  const editHandler = () => {};

  return isLoading ? (
    <Loader />
  ) : (
    <div className="patientAddEditTopContainer mb-4">
      <div className="patientAddEditContainer">
        <div className="patient-detials-input-fields gap-8 marginEdit">
          <span className="mb-2 sub-heading">Visit Details</span>

          <div className="label-input-container mb-2">
            <label htmlFor="dateofVisit">Date of Visit*</label>
            <input
              id="dateofVisit"
              name="dateofVisit"
              type="date"
              value={formValues.dateofVisit}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-2 arches-container">
            <div className="step-container">
              <label className="">Visit Type</label>
              <Dropdown
                key={'visit-type'}
                options={visitTypes}
                selectedValue={formValues.visitType}
                onChangeCallBk={(value) =>
                  handleInputChange({
                    target: { name: 'visitType', value },
                  })
                }
              />
            </div>
          </div>
          <div className="arches-container">
            <div className="step-container">
              <label className="">Aligner Tracking</label>
              <Dropdown
                options={alignerTracking}
                selectedValue={formValues.alignerTracking}
                onChangeCallBk={(value) =>
                  handleInputChange({
                    target: { name: 'alignerTracking', value },
                  })
                }
              />
            </div>
          </div>
        </div>

        <TextArea
          posClassName={`patient-detials-input-fields gap-8 sub-heading marginEdit`}
          key={'notesForVisit'}
          label={'Visit Notes:'}
          id={'notesForVisit'}
          name="notesForVisit"
          placeholder={
            isEdit ? 'Enter progress notes here...' : 'No notes available'
          }
          value={formValues.notesForVisit}
          onChangeCallBack={handleInputChange}
        />

        <div
          className={`patient-detials-input-fields gap-8 pdf-container photo-scans ${
            isEdit ? 'marginEdit' : 'marginView'
          }`}
        >
          <MultipleImagesUploader
            label="Photos"
            labelkey="photos"
            fileTypeRestrictions="image/jpeg,image/png,image/gif,image/jpg"
            patientID={patientID}
            rebootID={rebootID}
            existingFiles={formValues.photos || []}
            onFilesUpload={handleFilesUpload}
            isEdit={isEdit}
            // isEdit
            imgClickHandler={openLightbox}
          />
        </div>

        <div className="arches-container">
          {!isEdit && <Button title="Cancel" onClickCallBk={editHandler} />}
          {isEdit && <Button title="Cancel" onClickCallBk={cancelHandler} />}
          {isEdit && (
            <Button title="Save" type="primary" onClickCallBk={saveHandler} />
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(TreatmentProgressForm);
