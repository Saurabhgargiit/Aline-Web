import React, { useState } from 'react';
import { Badge } from 'react-bootstrap';

import TextArea from '../../../components/TextArea/TextArea';
import Button from '../../../components/Button/Button';

import { plans, steps, tags } from '../treatmentPlanConstants';
import TreatmentPlanModal from './TreatmentPlanModal';

const TreatmentPlanView = ({ approveHandler, reqModFn }) => {
  function renderCheckboxGroup(label, options, formValues) {
    return (
      <section className={`patient-detials-input-fields gap-8 marginView`}>
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
                type="number"
                className="step-input"
                id={option.key}
                min={0}
                disabled
                value={10}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }
  const cancelHandler = () => {};
  return (
    <div className="patientAddEditTopContainer">
      <div className="patientAddEditContainer">
        <div className={`patient-detials-input-fields gap-8 marginEdit`}>
          <span className="mb-2 sub-heading">Malocclusion Tags </span>
          <div className="tags-container">
            <Badge pill bg={'primary'} className="tag">
              {'label'}
            </Badge>
          </div>
        </div>
        <label
          className={
            'patient-detials-input-fields gap-8 sub-heading marginView'
          }
        >
          Case Assessment:
          <p>
            The patient is having issues in front side kfdskg fjdhfkjhsdkjghiaer
            ifgdkj kjdnfdkjlsan kjfkjsdg kjgfkjsfdgdfs kgkjdsfhgkjs wejiuwqyriu
            w
          </p>
        </label>

        <label
          className={
            'patient-detials-input-fields gap-8 sub-heading marginView'
          }
        >
          Treatment Plan Summary:
          <p>
            The patient is having issues in front side kfdskg fjdhfkjhsdkjghiaer
            ifgdkj kjdnfdkjlsan kjfkjsdg kjgfkjsfdgdfs kgkjdsfhgkjs wejiuwqyriu
            w
          </p>
        </label>

        {renderCheckboxGroup('No. of Steps:', steps, 'formValues')}

        <div className={`patient-detials-input-fields gap-8 marginView`}>
          <span className="mb-2 sub-heading">Treatment Plan Category:</span>
          <div className="arches-container">
            <div className="step-container">
              <label className="">
                Plan Type: &nbsp; <span>Light</span>
              </label>
            </div>
            <div className="step-container">
              <label className="">
                Price Quotation: &nbsp; <span>1500 AED</span>
              </label>
            </div>
          </div>
        </div>

        <div className={`patient-detials-input-fields gap-8 marginView`}>
          <span className="mb-2 sub-heading">IPR and Attachment Report</span>
          <div className="arches-container"></div>
        </div>

        <div className={`patient-detials-input-fields gap-8 marginView`}>
          <span className="mb-2 sub-heading">Treatment Simulation</span>
          <div className="arches-container">
            <label className="">Plan URL</label>
          </div>
          <div className="arches-container">
            <label className="">Upload Video</label>
          </div>
        </div>

        <div className="arches-container">
          <Button
            title="Approve Plan"
            type="primary"
            onClickCallBk={approveHandler}
          />
          <Button
            title="Request for modification"
            type="primary"
            onClickCallBk={reqModFn}
          />
        </div>
      </div>
    </div>
  );
};

export default TreatmentPlanView;
