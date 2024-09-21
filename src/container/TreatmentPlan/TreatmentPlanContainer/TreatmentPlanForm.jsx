import React, { useState, memo } from 'react';
import { useParams } from 'react-router-dom';
import { toast, Bounce } from 'react-toastify';

import { Badge } from 'react-bootstrap';

import TextArea from '../../../components/TextArea/TextArea';
import Dropdown from '../../../components/Dropdown/Dropdown';
import Loader from '../../common/Loader/Loader';
import MultiSelectDropdown from '../../../components/Dropdown/MultiSelectDropdown';
import Button from '../../../components/Button/Button';
import { plans, steps, tags, currencies } from '../treatmentPlanConstants';
import { postCall, putCall } from '../../../utils/commonfunctions/apicallactions';
import FileUploader from '../../../components/FileUploader/FileUploader';

import './TreatmentPlanForm.scss';

const TreatmentPlanForm = (props) => {
  const { 
    existingData, 
    cancelHandler,
    cancelFlag, 
    isEdit, 
    planId, 
    redirectToCurrentDraft, 
    redirectToLatestDraft,
    patientID,
    rebootID
  } = props;

  const [errors, setErrors] = useState({});
  const [selectedTags, setSelectedTags] = useState(existingData?.malocclusionTag || []);

  const [isLoading, setIsLoading] = useState(false);

  const [formValues, setFormValues] = useState({
    caseAssessment: existingData?.caseAssessment || '',
    treatmentPlanSummary: existingData?.treatmentPlanSummary || '',
    upperSteps: existingData?.upperSteps || 0,
    lowerSteps: existingData?.lowerSteps || 0,
    expectedDuration: existingData?.expectedDuration || 0,
    treatmentPlanCategory: existingData?.treatmentPlanCategory || 'featherPlan',
    price: existingData?.price || { currency: 'aed', price: 0 },
    iprAndAttachmentReports: existingData?.iprAndAttachmentReports || [],
    treatmentSimulationsURL: existingData?.treatmentSimulationsURL || [],
    treatmentSimulationsAttachments: existingData?.treatmentSimulationsAttachments || [],
  });

  const saveHandler = () => {
      //post selectedFiles to backend
      const payload = { ...formValues };
      payload['malocclusionTag'] = selectedTags;
      payload['patientID'] = patientID;
      payload['id'] = isEdit ? planId : null;
      payload['treatmentPlanID'] = null;
      setIsLoading(true);
      const callFn = isEdit? putCall : postCall;
      const successMsg = isEdit ? 'Treatment Plan Modified.' :'Treatment Plan Added.'
      const url = isEdit? 'UPDATE_TREATMENT_PLAN' : 'CREATE_TREATMENT_PLAN';
      callFn(payload, url, [patientID, rebootID]).then((data) => {
          if (data.result === 'success') {
              toast.success(successMsg, {
                  position: 'top-right',
                  hideProgressBar: false,
                  autoClose: 2000,
                  closeOnClick: true,
                  // pauseOnHover: true,
                  theme: 'light',
                  transition: Bounce,
              });
              setIsLoading(true);
              isEdit? redirectToCurrentDraft(planId) : redirectToLatestDraft() 

          } else if (data.result === 'error') {
              toast.error(data.error ?? 'data.error', {
                  position: 'top-right',
                  hideProgressBar: false,
                  autoClose: 2000,
                  closeOnClick: true,
                  // pauseOnHover: true,
                  theme: 'light',
                  transition: Bounce,
              });
              setIsLoading(false);
          }
          // setLoading(false);
      });
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };



  const tagChangeHandler = (e, value) => {
    if (e.target.checked) {
      setSelectedTags((prev) => [...prev, value]);
    } else {
      setSelectedTags((prev) => prev.filter((el) => el !== value));
    }
  };

  const handlePriceChange = (e, type) => {
    const { value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      price: {
        ...prevValues.price,
        [type]: value,
      },
    }));
  };

  const handleFileUpload = (type, fileData) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [type]: [...prevValues[type], fileData],
    }));
  };

  const handleCheckboxChange = () => {};


  const uploadVideoHandler = () => {};

  function renderCheckboxGroup(
    label,
    options,
    formValues,
    handleChange,
    errors,
    isEdit,
    handleInputChange
  ) {
    return (
      <section
        className={`patient-detials-input-fields gap-8 ${
          isEdit ? 'marginEdit' : 'marginView'
        }`}
      >
        <span className="mb-2 sub-heading" key={label}>
          {label}
        </span>
        <div className="arches-container">
          {options.map((option, i) => (
            <div className="step-container" key={'div' + option.key}>
              <label key={option.key} htmlFor={option.key} className="label">
                {option.label}
              </label>
              <input
                className="step-input"
                type="number"
                id={option.key}
                min={0}
                value={formValues[option.value]}
                onChange={(e) => handleChange({ target: { name: option.value, value: e.target.value } })}
              />
            </div>
          ))}
        </div>
        {/* {errors[mainKey] && <p className="error-Msg">{errors[mainKey]}</p>} */}
      </section>
    );
  }
  return (
    isLoading ? 
      <Loader/> 
    :
    <div className="patientAddEditTopContainer mb-4">
      <div className="patientAddEditContainer">
        <div className={`patient-detials-input-fields gap-8 marginEdit`}>
          <span className="mb-2 sub-heading">Malocclusion Tags </span>
          <MultiSelectDropdown
            label={'Select Tags'}
            options={tags}
            handleCheckboxChange={tagChangeHandler}
            selectedCheckBox={selectedTags}
            className={'dropdown-width'}
          />
          <div className="tags-container">
            {selectedTags.length > 0 &&
              selectedTags.map((el, i) => {
                const tagDetail = tags.find(tag => tag.value === el);
                console.log(tagDetail);
                const { label, color } = tagDetail;
                return (
                  <Badge pill key={el + i} bg={color} className="tag">
                    {label}
                  </Badge>
                );
              })}
          </div>
        </div>
        <TextArea
          posClassName={`patient-detials-input-fields gap-8 sub-heading marginEdit`}
          key={'caseAssessment'}
          label={'Case Assessment:'}
          id={'caseAssessment'}
          placeholder={isEdit ? 'Enter details here...' : 'No details given'}
          value={formValues.caseAssessment}
          onChangeCallBack={e =>
            handleInputChange({ target: { name: 'caseAssessment', value: e.target.value } })
          }
        />

        {errors.chiefComplaint && (
          <p className="error-Msg">{errors.chiefComplaint}</p>
        )}

        <TextArea
          posClassName={`patient-detials-input-fields gap-8 sub-heading marginEdit`}
          key={'treatmentPlanSummary'}
          label={'Treatment Plan Summary:'}
          id={'treatmentPlanSummary'}
          placeholder={isEdit ? 'Enter details here...' : 'No details given'}
          value={formValues.treatmentPlanSummary}
          onChangeCallBack={e =>
            handleInputChange({ target: { name: 'treatmentPlanSummary', value: e.target.value } })
          }
        />

        {errors.chiefComplaint && (
          <p className="error-Msg">{errors.chiefComplaint}</p>
        )}

        {renderCheckboxGroup(
          "No of Steps",
          steps,
          formValues,
          handleInputChange,
          errors,
          isEdit,
        )}

        <div className={`patient-detials-input-fields gap-8 marginEdit`}>
          <span className="mb-2 sub-heading">Treatment Plan Category</span>
          <div className="arches-container">
            <div className="step-container">
              <label className="">Plan Type</label>
              <Dropdown 
                options={plans} 
                selectedValue={formValues.treatmentPlanCategory}
                onChangeCallBk={(value) =>
                  handleInputChange({ target: { name: 'treatmentPlanCategory', value } })
                }
              />
            </div>
            <div className="step-container">
              <label className="">Price Quotation</label>
              <input
                className="price-quote"
                type="number"
                min={0}
                placeholder="0"
                value={formValues.price.price}
                onChange={(e) => handlePriceChange(e, 'price')}
              />
              <Dropdown 
                options={currencies}            
                selectedValue={formValues.price.currency}
                onChangeCallBk={(value) => handlePriceChange({target:{value}}, 'currency')} />
            </div>
          </div>
        </div>

        <div
          className={`patient-detials-input-fields gap-8 pdf-container ${
            isEdit ? 'marginEdit' : 'marginView'
          } `}
        >
          <span className="mb-2 sub-heading">IPR and Attachment Report</span>
          <div className="arches-container pdf-container">
            <FileUploader 
              label='IPR_Report' 
              fileType='pdf' 
              onUploadComplete={(fileData) => handleFileUpload('iprAndAttachmentReports', fileData)} 
              patientID={patientID}
            />
          </div>
        </div>

        <div
          className={`patient-detials-input-fields gap-8 pdf-container ${
            isEdit ? 'marginEdit' : 'marginView'
          }`}
        >
          <span className="mb-2 sub-heading">Treatment Simulation</span>
          <div className="arches-container">
            <label htmlFor="planURL" className="">Plan URL</label>
            <input 
              id='planURL'
              type="text" 
              value={formValues.treatmentSimulationsURL} 
              onChange={e => handleInputChange({ target: { name: 'treatmentSimulationsURL', value: [e.target.value] } })}
            />
          </div>
          <div className="arches-container pdf-container">
            <label className="">Upload Video</label>
            <FileUploader 
              label='Treatment_Video' 
              fileType='video' 
              onUploadComplete={(fileData) => handleFileUpload('treatmentSimulationsAttachments', fileData)} 
              patientID={patientID} 
              styleClassName={'pdf-container'}
            />

            {/* <Button
              svg={<AttachmentIcon />}
              ariaLabel="upload-video button"
              tooltip="Upload Video"
              className="attachment-btn"
              onClickCallBk={uploadVideoHandler}
            /> */}
          </div>
        </div>

        <div className="arches-container">
          <Button title="Cancel" onClickCallBk={cancelHandler} />
          <Button title="Save" type="primary" onClickCallBk={saveHandler}/>
          {/* <Button title="Share" type="primary" onClickCallBk={shareHandler}/> */}
        </div>
      </div>
    </div>
  );
};

export default memo(TreatmentPlanForm);
