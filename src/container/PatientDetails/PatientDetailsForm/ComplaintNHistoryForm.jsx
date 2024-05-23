import React, { useState, useEffect, memo } from 'react';
import Button from '../../../components/Button/Button';

function ComplaintNHistoryForm({
    isEdit = true,
    formData,
    setFormData,
    clickHandler,
    cancelHandler,
}) {
    // State to hold form data, initialized from props
    const [formValues, setFormValues] = useState({
        chiefComplaint: '',
        crownBridges: false,
        crownBridgesDetails: '',
        implants: false,
        implantsDetails: '',
        veneers: false,
        veneersDetails: '',
        previousTreatment: false,
        previousTreatmentDetails: '',
        composites: false,
        compositesDetails: '',
        historyOthers: '',
    });

    const [errors, setErrors] = useState({});

    // Validation function
    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;

        if (!formValues.chiefComplaint?.trim()) {
            tempErrors.chiefComplaint = 'Chief complaint is required.';
            isValid = false;
        }

        const detailFields = [
            'crownBridges',
            'implants',
            'veneers',
            'previousTreatment',
            'composites',
        ];
        detailFields.forEach((field) => {
            if (formValues[field] && !formValues[`${field}Details`]?.trim()) {
                tempErrors[`${field}Details`] = "Details are required when selected 'Yes'.";
                isValid = false;
            }
        });

        setErrors(tempErrors);
        return isValid;
    };

    // Handle form submission
    const handleNext = () => {
        if (!isEdit || validateForm()) {
            isEdit && setFormData(formValues);
            clickHandler('profile');
        } else {
            window.scrollTo(0, 0);
        }
    };

    //Effect hook to update state when the formData prop changes
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
                    <label htmlFor='chief-complaint'>Chief Complaint:*</label>
                    <textarea
                        id='chief-complaint'
                        name='chief-complaint'
                        rows='3'
                        placeholder='Enter details here...'
                        disabled={!isEdit}
                        value={formValues.chiefComplaint}
                        onChange={(e) =>
                            setFormValues({ ...formValues, chiefComplaint: e.target.value })
                        }
                    ></textarea>
                    {errors.chiefComplaint && <p className='error-Msg'>{errors.chiefComplaint}</p>}
                </div>
                <div className='font500 center-position heading'>
                    <span>~~~~~~~~~~~~~~~~~~~~Previous Dental History~~~~~~~~~~~~~~~~~~~~</span>
                </div>
                {Object.entries({
                    crownBridges: 'Crown/Bridges',
                    implants: 'Implants',
                    veneers: 'Veneers',
                    previousTreatment: 'Previous Orthodontic Treatment',
                    composites: 'Composites/Buildup',
                }).map(([key, label]) => (
                    <div
                        className={`patient-detials-input-fields gap-8 ${
                            isEdit ? 'marginEdit' : 'marginView'
                        }`}
                        key={key}
                    >
                        <label htmlFor={key} className='checkbox-container sub-heading'>
                            {label + ':'}
                            {isEdit && (
                                <>
                                    <input
                                        type='checkbox'
                                        id={key}
                                        checked={formValues[key]}
                                        onChange={(e) => {
                                            setFormValues({
                                                ...formValues,
                                                [key]: e.target.checked,
                                            });
                                        }}
                                        disabled={!isEdit}
                                    />

                                    <span className='checkbox'></span>
                                </>
                            )}
                            {!isEdit && (
                                <span className={`info ${formValues[key] ? 'yes' : 'no'}`}>
                                    {formValues[key] ? 'Yes' : 'No'}
                                </span>
                            )}
                        </label>

                        {(isEdit || formValues[key]) && (
                            <>
                                {isEdit && (
                                    <label htmlFor={formValues[`${key}Details`]}>
                                        If Yes, Details:{' '}
                                    </label>
                                )}
                                <input
                                    type='text'
                                    id={formValues[`${key}Details`]}
                                    value={formValues[`${key}Details`]}
                                    onChange={(e) => {
                                        setFormValues({
                                            ...formValues,
                                            [`${key}Details`]: e.target.value,
                                        });
                                    }}
                                    disabled={!isEdit || !formValues[key]}
                                />
                                {errors[`${key}Details`] && (
                                    <p className='error-Msg'>{errors[`${key}Details`]}</p>
                                )}
                            </>
                        )}
                    </div>
                ))}
                <div className='patient-detials-input-fields gap-8 sub-heading'>
                    <label htmlFor='historyOthers'>Others:</label>
                    <textarea
                        id='historyOthers'
                        name='historyOthers'
                        rows='3'
                        placeholder={isEdit ? 'Enter details here...' : 'No other details given'}
                        disabled={!isEdit}
                        value={formValues.historyOthers}
                        onChange={(e) =>
                            setFormValues({ ...formValues, historyOthers: e.target.value })
                        }
                    ></textarea>
                </div>
                <div className='buttons pt-4'>
                    <Button
                        postionClass='mx-5'
                        className={!isEdit ? 'noVisible' : ''}
                        title='Cancel'
                        onClickCallBk={cancelHandler}
                    />
                    <Button
                        postionClass='mx-5'
                        title='Next'
                        type='primary'
                        onClickCallBk={handleNext}
                    />
                </div>
            </div>
        </div>
    );
}

export default memo(ComplaintNHistoryForm);
