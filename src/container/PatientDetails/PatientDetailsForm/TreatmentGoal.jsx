import React, { useState, useEffect } from 'react';

import Button from '../../../components/Button/Button';

// Constants for arch, IPR, and attachment options
const archOptions = [
    { key: 'bothArches', label: 'Both Arches' },
    { key: 'onlyUpper', label: 'Only Upper' },
    { key: 'onlyLower', label: 'Only Lower' },
];

const iprOptions = [
    { key: 'noRestrictionIPR', label: 'No Restriction' },
    { key: 'selectiveIPR', label: 'Selective IPR' },
    { key: 'noIPR', label: 'No IPR' },
];

const attachmentOptions = [
    { key: 'noRestrictionAttachments', label: 'No Restriction' },
    { key: 'selectiveAttachments', label: 'Selective attachments' },
    { key: 'noAttachments', label: 'No attachments' },
];

// Helper function to render checkbox groups
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
        <div
            className={`patient-detials-input-fields gap-8 ${isEdit ? 'marginEdit' : 'marginView'}`}
        >
            <span className='mb-2 sub-heading'>{label}*</span>
            <div className='arches-container'>
                {options.map((option) => (
                    <label key={option.key} htmlFor={option.key} className='checkbox-container'>
                        {option.label}
                        <input
                            type='checkbox'
                            id={option.key}
                            checked={formValues[mainKey]?.includes(option.key)}
                            onChange={() => handleChange(option.key, mainKey)}
                            disabled={!isEdit}
                        />
                        <span className='checkbox'></span>
                    </label>
                ))}
            </div>
            {errors[mainKey] && <p className='error-Msg'>{errors[mainKey]}</p>}
            {mainKey !== 'arches' && (
                <>
                    <label htmlFor={`'${mainKey}details`}>{detailsLabel} Details</label>
                    <input
                        id={`'${mainKey}details`}
                        type='text'
                        value={formValues[`${mainKey}Details`]}
                        onChange={(e) => handleInputChange(`${mainKey}Details`, e.target.value)}
                        disabled={!isEdit || formValues[mainKey]?.includes(options[0].key)}
                    />
                    {errors[`${mainKey}Details`] && (
                        <p className='error-Msg'>{errors[[`${mainKey}Details`]]}</p>
                    )}
                </>
            )}
        </div>
    );
}

function TreatmentGoal({ isEdit = true, formData, clickHandler }) {
    // State to hold form data, initialized from props
    const [formValues, setFormValues] = useState({
        correction: '',
        arches: [], //should be one of the defaultArchValues (mandatory)
        ipr: [], //should be one of the defaultIPRValues (mandatory)
        iprDetails: '', //mandatory if "selectiveIPR"  selected
        attachments: [], //should be one of the defaultArchValues (mandatory)
        attachmentsDetails: '', //mandatory if "selectiveAttachments"  selected
        treatmentGoalOthers: '', //No mandatory
    });

    const [errors, setErrors] = useState({});

    // Handles changing of input fields
    const handleInputChange = (key, value) => {
        setFormValues((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // Handles checkbox changes
    const handleCheckboxChange = (optionKey, arrayKey) => {
        setFormValues((prev) => ({
            ...prev,
            [arrayKey]: [optionKey],
        }));
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formValues.correction?.trim()) {
            newErrors.correction = 'Correction details are required.';
        }

        if (!formValues.arches?.length) {
            newErrors.arches = 'Please select arches.';
        }
        if (!formValues.ipr?.length) {
            newErrors.ipr = 'Please select an IPR option.';
        } else if (formValues.ipr?.includes('selectiveIPR') && !formValues.iprDetails?.trim()) {
            newErrors.iprDetails = 'Details are required for IPR.';
        }

        if (!formValues.attachments?.length) {
            newErrors.attachments = 'Please select an attachment option.';
        } else if (
            formValues.attachments?.includes('selectiveAttachments') &&
            !formValues.attachmentsDetails?.trim()
        ) {
            newErrors.attachmentsDetails = 'Details are required for attachments.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handles the form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            console.log('Submitting form with values:', formValues);
            // Submit logic goes here
        }
    };

    useEffect(() => {
        if (formData) {
            setFormValues(formData);
        }
    }, [formData]);

    useEffect(() => {
        if (Object.keys(errors).length) {
            validateForm();
        }
    }, [formValues]);

    return (
        <div className='patientAddEditTopContainer'>
            <div className='patientAddEditContainer'>
                <div
                    className={`patient-detials-input-fields gap-8 sub-heading ${
                        isEdit ? 'marginEdit' : 'marginView'
                    }`}
                >
                    <label htmlFor='correction'>Details of Correction Needed:*</label>
                    <textarea
                        id='correction'
                        name='correction'
                        rows='3'
                        placeholder='Enter details here...'
                        disabled={!isEdit}
                        value={formValues.correction}
                        onChange={(e) => handleInputChange('correction', e.target.value)}
                    ></textarea>
                    {errors.correction && <p className='error-Msg'>{errors.correction}</p>}
                </div>

                {renderCheckboxGroup(
                    'Arches',
                    'arches',
                    'Arches',
                    archOptions,
                    formValues,
                    handleCheckboxChange,
                    errors,
                    isEdit,
                    handleInputChange
                )}

                {renderCheckboxGroup(
                    'Any Restriction on IPR',
                    'ipr',
                    'IPR',
                    iprOptions,
                    formValues,
                    handleCheckboxChange,
                    errors,
                    isEdit,
                    handleInputChange
                )}

                {renderCheckboxGroup(
                    'Any Restriction on Attachments',
                    'attachments',
                    'Attachments',
                    attachmentOptions,
                    formValues,
                    handleCheckboxChange,
                    errors,
                    isEdit,
                    handleInputChange
                )}

                <div className='patient-detials-input-fields gap-8 sub-heading'>
                    <label htmlFor='treatmentGoalOthers'>Others:</label>
                    <textarea
                        id='treatmentGoalOthers'
                        name='treatmentGoalOthers'
                        rows='3'
                        placeholder={isEdit ? 'Enter details here...' : 'No other details given'}
                        disabled={!isEdit}
                        value={formValues.treatmentGoalOthers}
                        onChange={(e) =>
                            setFormValues({ ...formValues, treatmentGoalOthers: e.target.value })
                        }
                    ></textarea>
                </div>
                <div className='buttons pt-4'>
                    <Button
                        postionClass='mx-5'
                        title='Back'
                        onClickCallBk={() => clickHandler('home')}
                    />
                    <Button
                        postionClass='mx-5'
                        className={!isEdit ? 'noVisible' : ''}
                        title='Save'
                        type='primary'
                    />
                </div>
            </div>
        </div>
    );
}

export default TreatmentGoal;
