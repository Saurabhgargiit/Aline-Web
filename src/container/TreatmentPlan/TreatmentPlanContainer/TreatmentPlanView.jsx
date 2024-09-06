import React, { useState } from 'react';
import { Badge } from 'react-bootstrap';

import TextArea from '../../../components/TextArea/TextArea';
import Button from '../../../components/Button/Button';

import { plans, steps, tags } from '../treatmentPlanConstants';
import TreatmentPlanModal from './TreatmentPlanModal';

const TreatmentPlanView = ({ approveHandler, reqModFn, planInfo }) => {


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
                value={planInfo[option.value]}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }
  const {
    caseAssessment,
    treatmentPlanSummary,
    malocclusionTag,
    upperSteps,
    lowerSteps,
    expectedDuration,
    treatmentPlanCategory,
    price,
    iprAndAttachmentReports,
    treatmentSimulationsURL,
    treatmentSimulationsAttachments,
  } = planInfo;
  
  return (
    <div className="patientAddEditTopContainer  mb-4">
      <div className="patientAddEditContainer">
        <div className={`patient-detials-input-fields gap-8 marginEdit`}>
          <span className="mb-2 sub-heading">Malocclusion Tags </span>
          <div className="tags-container">
            {/* <Badge pill bg={'primary'} className="tag">
              {'label'}
            </Badge> */}
            {malocclusionTag && malocclusionTag.length > 0 ? (
              malocclusionTag.map((tag, index) => (
                <Badge pill bg="primary" className="tag" key={index}>
                  {tag}
                </Badge>
              ))
            ) : (
              <Badge pill bg="secondary" className="tag">
                No Tags
              </Badge>
            )}
          </div>
        </div>
        <label
          className={
            'patient-detials-input-fields gap-8 sub-heading marginView'
          }
        >
          Case Assessment:
          <p>
            {caseAssessment || 'No assessment provided'}
          </p>
        </label>

        <label
          className={
            'patient-detials-input-fields gap-8 sub-heading marginView'
          }
        >
          Treatment Plan Summary:
          <p>
          {treatmentPlanSummary || 'No summary provided'}
          </p>
        </label>

        {renderCheckboxGroup('No. of Steps:', steps, 'formValues')}

        <div className={`patient-detials-input-fields gap-8 marginView`}>
          <span className="mb-2 sub-heading">Treatment Plan Category:</span>
          <div className="arches-container">
            <div className="step-container">
              <label className="">
                Plan Type: &nbsp; <span>{treatmentPlanCategory}</span>
              </label>
            </div>
            <div className="step-container">
              <label className="">
                Price Quotation: &nbsp; <span>{price?.price} {price?.currency?.toUpperCase()}</span>
              </label>
            </div>
          </div>
        </div>

        <div className={`patient-detials-input-fields gap-8 marginView`}>
          <span className="mb-2 sub-heading">IPR and Attachment Report</span>
          <div className="arches-container">
          {iprAndAttachmentReports && iprAndAttachmentReports.length > 0 ? (
              iprAndAttachmentReports.map((report, index) => (
                <div key={index}>
                  <a href={report.url} target="_blank" rel="noopener noreferrer">
                    View Attachment {index + 1}
                  </a>
                </div>
              ))
            ) : (
              <p>No IPR and attachment reports</p>
            )}
          </div>
        </div>

        <div className={`patient-detials-input-fields gap-8 marginView`}>
          <span className="mb-2 sub-heading">Treatment Simulation</span>
          <div className="arches-container">
            <label className="">
              Plan URL: &nbsp;
              {treatmentSimulationsURL.length > 0 ? (
                <a
                  href={treatmentSimulationsURL[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Simulation
                </a>
              ) : (
                'No URL provided'
              )}
            </label>
          </div>
          <div className="arches-container">
            <label className="">
              Upload Video: &nbsp;
              {treatmentSimulationsAttachments.length > 0 ? (
                <a
                  href={treatmentSimulationsAttachments[0]?.url}
                  target="_blank"
                  // rel="noopener noreferrer"
                >
                  View Video
                </a>
              ) : (
                'No video uploaded'
              )}
            </label>
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
