import React, { useState } from 'react';
import { Badge } from 'react-bootstrap';

import Button from '../../../components/Button/Button';

import { steps } from '../treatmentPlanConstants';
import { useLocation } from 'react-router-dom';
import FileUploader from '../../../components/FileUploader/FileUploader';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

import './TreatmentPlanForm.scss';

const TreatmentPlanView = ({
  planInfo,
  isLabSideUser,
  editOptionHandler,
  actionHandler,
}) => {
  const location = useLocation();
  const isDraftPlan = location.pathname.includes('DraftPlan');

  function renderCheckboxGroup(label, options, formValues) {
    return (
      <section className={`patient-details-input-fields gap-8 marginView`}>
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
        <div className={`patient-details-input-fields gap-8 marginEdit`}>
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
            'patient-details-input-fields gap-8 sub-heading marginView'
          }
        >
          Case Assessment:
          <p>{caseAssessment || 'No assessment provided'}</p>
        </label>

        <label
          className={
            'patient-details-input-fields gap-8 sub-heading marginView'
          }
        >
          Treatment Plan Summary:
          <p>{treatmentPlanSummary || 'No summary provided'}</p>
        </label>

        {renderCheckboxGroup('No. of Steps:', steps, 'formValues')}

        <div className={`patient-details-input-fields gap-8 marginView`}>
          <span className="mb-2 sub-heading">Treatment Plan Category:</span>
          <div className="arches-container">
            <div className="step-container">
              <label className="">
                Plan Type: &nbsp; <span>{treatmentPlanCategory}</span>
              </label>
            </div>
            {/* <div className="step-container">
              <label className="">
                Price Quotation: &nbsp;{' '}
                <span>
                  {price?.price} {price?.currency?.toUpperCase()}
                </span>
              </label>
            </div> */}
          </div>
        </div>

        <div className={`patient-details-input-fields gap-8 marginView`}>
          <span className="mb-2 sub-heading">IPR and Attachment Report</span>
          <div className="arches-container pdf-container">
            {iprAndAttachmentReports && iprAndAttachmentReports.length > 0 ? (
              iprAndAttachmentReports.map((report, index) => (
                <FileUploader
                  key={'pdf-view-IPR ' + index}
                  id={'pdf-view-IPR ' + index}
                  label="IPR_Report"
                  fileType="pdf"
                  onUploadComplete={(fileData) => () => {}}
                  styleClassName={'pdf-container'}
                  uploadedFileFromProps={report?.url}
                  isEdit={false}
                />
              ))
            ) : (
              <p className="no-url">No IPR and attachment reports</p>
            )}
          </div>
        </div>

        <div
          className={`patient-details-input-fields gap-8 pdf-container marginView`}
        >
          <span className="mb-2 sub-heading">Treatment Simulation</span>
          <div className="flexWithJustifyContent planURL">
            <label>
              Plan URL: &nbsp;
              {treatmentSimulationsURL && treatmentSimulationsURL.length > 0 ? (
                <OverlayTrigger
                  key={'planurl'}
                  placement={'top'}
                  overlay={
                    <Tooltip id={'planurl'}>
                      {treatmentSimulationsURL?.[0]}
                    </Tooltip>
                  }
                >
                  <a
                    href={
                      treatmentSimulationsURL?.[0].startsWith('http')
                        ? treatmentSimulationsURL?.[0]
                        : `http://${treatmentSimulationsURL?.[0]}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {treatmentSimulationsURL?.[0]}
                  </a>
                </OverlayTrigger>
              ) : (
                <span className="no-url">No URL available</span>
              )}
            </label>
          </div>
          <div className="pdf-container mt-3">
            <label className=""> Treatment Simulation Video: &nbsp;</label>
            {treatmentSimulationsAttachments &&
            treatmentSimulationsAttachments.length > 0 ? (
              <FileUploader
                key={'video-upload'}
                id={'video-upload'}
                label="Treatment_Video"
                fileType="video"
                onUploadComplete={(fileData) => {}}
                uploadedFileFromProps={treatmentSimulationsAttachments[0]?.url}
                isEdit={false}
              />
            ) : (
              <span className="no-url">No Video available</span>
            )}
          </div>
        </div>

        {/* <div className={`patient-details-input-fields gap-8 marginView`}>
          <span className="mb-2 sub-heading">Treatment Simulation</span>
          <div className="arches-container">
            <label className="">
              Treatment Simulation Video: &nbsp;
              {treatmentSimulationsAttachments &&
              treatmentSimulationsAttachments.length > 0 ? (
                <a
                  href={treatmentSimulationsAttachments[0]?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Video
                </a>
              ) : (
                <span className="no-url">No Video available</span>
              )}
            </label>
          </div>
        </div> */}

        <div className="flexWithJustifyContent">
          {!isLabSideUser && !isDraftPlan && (
            <Button
              title="Approve Plan"
              type="primary"
              onClickCallBk={() => actionHandler('approve')}
            />
          )}
          {!isLabSideUser && !isDraftPlan && (
            <Button
              title="Request for modification"
              type="primary"
              onClickCallBk={() => actionHandler('reqMod')}
            />
          )}
          {isLabSideUser && isDraftPlan && (
            <Button
              title="Edit Treatment Plan"
              type="primary"
              onClickCallBk={editOptionHandler}
            />
          )}
          {isLabSideUser && isDraftPlan && (
            <Button
              title="Share Plan with Clinic"
              type="primary"
              onClickCallBk={() => actionHandler('sharePlan')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TreatmentPlanView;
