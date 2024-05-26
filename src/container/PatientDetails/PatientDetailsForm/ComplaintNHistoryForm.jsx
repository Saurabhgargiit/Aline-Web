import React, { useState, useEffect, memo } from 'react';
import Button from '../../../components/Button/Button';

const labels = {
    crownsBridges: 'Crown/Bridges',
    implants: 'Implants',
    veneers: 'Veneers',
    previousTreatment: 'Previous Orthodontic Treatment',
    composites: 'Composites/Buildup',
};

function ComplaintNHistoryForm({
    isEdit = true,
    formData,
    setFormData,
    clickHandler,
    cancelHandler,
    cancelFlag,
}) {
    const initObj = {};
    Object.keys(labels).forEach((el) => {
        initObj[el] = {};
        initObj[el]['flag'] = false;
        initObj[el]['details'] = '';
    });
    const [formValues, setFormValues] = useState({
        chiefComplaint: '',
        historyOthers: '',
        ...initObj,
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

        Object.keys(labels).forEach((field) => {
            if (formValues[field]?.flag && !formValues[field]['details']?.trim()) {
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

    const checkBoxHandler = (e, key) => {
        setFormValues((prevState) => {
            return {
                ...prevState,
                [key]: {
                    ...prevState[key],
                    flag: e.target.checked,
                    details: !e.target.checked ? '' : prevState[key].details,
                },
            };
        });
    };

    //Effect hook to update state when the formData prop changes
    useEffect(() => {
        console.log(formData);
        if (Object.keys(formData).length !== 0) {
            setFormValues(formData);
        }
    }, [formData, cancelFlag]);
    // console.log('Form Values:', formValues);

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
                {Object.entries(labels).map(([key, label]) => (
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
                                        checked={formValues[key]?.flag}
                                        onChange={(e) => checkBoxHandler(e, key)}
                                        disabled={!isEdit}
                                    />

                                    <span className='checkbox'></span>
                                </>
                            )}
                            {!isEdit && (
                                <span className={`info ${formValues[key]?.flag ? 'yes' : 'no'}`}>
                                    {formValues[key]?.flag ? 'Yes' : 'No'}
                                </span>
                            )}
                        </label>

                        {(isEdit || (formValues[key] && formValues[key]?.flag)) && (
                            <>
                                {isEdit && (
                                    <label htmlFor={formValues[`${key}Details`]}>
                                        If Yes, Details:{' '}
                                    </label>
                                )}
                                <input
                                    type='text'
                                    id={formValues[`${key}Details`]}
                                    value={formValues[key].details}
                                    onChange={(e) => {
                                        setFormValues({
                                            ...formValues,
                                            [key]: {
                                                ...formValues[key],
                                                details: e.target.value,
                                            },
                                        });
                                    }}
                                    disabled={
                                        !isEdit || !(formValues[key] && formValues[key]?.flag)
                                    }
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

// export default ComplaintNHistoryForm;
export default memo(ComplaintNHistoryForm);
