import React, { useState } from 'react';
import { Badge } from 'react-bootstrap';

import TextArea from '../../../components/TextArea/TextArea';
import Dropdown from '../../../components/Dropdown/Dropdown';
import MultiSelectDropdown from '../../../components/Dropdown/MultiSelectDropdown';
import Button from '../../../components/Button/Button';
import { plans, steps, tags, currencies } from '../treatmentPlanConstants';

import { ReactComponent as AttachmentIcon } from '../../../assets/icons/attachment.svg';

import './TreatmentPlanForm.scss';

const TreatmentPlanForm = ({ isEdit, cancelHandler }) => {
  const [errors, setErrors] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);

  const [formValues, setFormValues] = useState({
    chiefComplaint: '',
    historyOthers: '',
  });

  const handleInputChange = () => {};

  const tagChangeHandler = (e, value) => {
    if (e.target.checked) {
      setSelectedTags(prev => [...prev, value]);
    } else {
      setSelectedTags(prev => selectedTags.filter(el => el !== value));
    }
  };

  const handleCheckboxChange = () => {};

  const uploadIPRHandler = () => {};

  const uploadVideoHandler = () => {};

  function renderCheckboxGroup(
    label,
    mainKey,
    detailsLabel,
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
                onChange={() => handleChange(option.key, mainKey)}
              />
            </div>
          ))}
        </div>
        {errors[mainKey] && <p className="error-Msg">{errors[mainKey]}</p>}
      </section>
    );
  }
  return (
    <div className="patientAddEditTopContainer">
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
          value={formValues.historyOthers}
          onChangeCallBack={e =>
            setFormValues({ ...formValues, historyOthers: e.target.value })
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
          value={formValues.historyOthers}
          onChangeCallBack={e =>
            setFormValues({ ...formValues, historyOthers: e.target.value })
          }
        />

        {errors.chiefComplaint && (
          <p className="error-Msg">{errors.chiefComplaint}</p>
        )}

        {renderCheckboxGroup(
          'No. of Steps:',
          'arches',
          'Arches',
          steps,
          formValues,
          handleCheckboxChange,
          errors,
          isEdit,
          handleInputChange
        )}

        <div className={`patient-detials-input-fields gap-8 marginEdit`}>
          <span className="mb-2 sub-heading">Treatment Plan Category</span>
          <div className="arches-container">
            <div className="step-container">
              <label className="">Plan Type</label>
              <Dropdown options={plans} />
            </div>
            <div className="step-container">
              <label className="">Price Quotation</label>
              <input
                className="price-quote"
                type="number"
                min={0}
                placeholder="0"
              />
              <Dropdown options={currencies} />
            </div>
          </div>
        </div>

        <div
          className={`patient-detials-input-fields gap-8 ${
            isEdit ? 'marginEdit' : 'marginView'
          }`}
        >
          <span className="mb-2 sub-heading">IPR and Attachment Report</span>
          <div className="arches-container">
            <Button
              svg={<AttachmentIcon />}
              ariaLabel="upload-pdf button"
              tooltip="Upload pdf"
              className="attachment-btn"
              onClickCallBk={uploadIPRHandler}
            />
          </div>
        </div>

        <div
          className={`patient-detials-input-fields gap-8 ${
            isEdit ? 'marginEdit' : 'marginView'
          }`}
        >
          <span className="mb-2 sub-heading">Treatment Simulation</span>
          <div className="arches-container">
            <label className="">Plan URL</label>
            <input type="text" />
          </div>
          <div className="arches-container">
            <label className="">Upload Video</label>
            <Button
              svg={<AttachmentIcon />}
              ariaLabel="upload-video button"
              tooltip="Upload Video"
              className="attachment-btn"
              onClickCallBk={uploadVideoHandler}
            />
          </div>
        </div>

        <div className="arches-container">
          <Button title="Cancel" onClickCallBk={cancelHandler} />
          <Button title="Save as Draft" type="primary" />
          <Button title="Save and Share" type="primary" />
        </div>
      </div>
    </div>
  );
};

export default TreatmentPlanForm;
