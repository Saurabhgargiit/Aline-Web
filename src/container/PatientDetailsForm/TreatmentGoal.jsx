import React, { useState } from 'react';

function TreatmentGoal() {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const nameChangeHandler = (e) => {
        const value = e.target.value;
        setName(() => value);
    };
    return (
        <div className='patientAddEditTopContainer'>
            <div className='patientAddEditContainer'>
                <div className='patient-detials-input-fields  gap-8 sub-heading'>
                    <label htmlFor='correction'>Details of Correction Needed*</label>
                    <input id='correction' type='text'></input>
                </div>
                <div className='patient-detials-input-fields'>
                    <span className='mb-2 sub-heading'>Arches*</span>
                    <div className='arches-container'>
                        <label htmlFor='both-arches' className='checkbox-container'>
                            Both Arches
                            <input id='both-arches' type='checkbox' />
                            <span className='checkbox'></span>
                        </label>
                        <label htmlFor='only-upper' className='checkbox-container'>
                            Only Upper
                            <input id='only-upper' type='checkbox' />
                            <span className='checkbox'></span>
                        </label>
                        <label htmlFor='only-lower' className='checkbox-container'>
                            Only Lower
                            <input id='only-lower' type='checkbox' />
                            <span className='checkbox'></span>
                        </label>
                    </div>
                </div>
                <div className='patient-detials-input-fields'>
                    <span className='mb-2 sub-heading'>Any Restriction on IPR*</span>
                    <div className='arches-container mb-1'>
                        <label htmlFor='no-restriction' className='checkbox-container'>
                            No Restriction
                            <input id='no-restriction' type='checkbox' />
                            <span className='checkbox'></span>
                        </label>
                        <label htmlFor='selective-ipr' className='checkbox-container'>
                            Selective IPR
                            <input id='selective-ipr' type='checkbox' />
                            <span className='checkbox'></span>
                        </label>
                        <label htmlFor='patient-ipr' className='checkbox-container'>
                            No IPR
                            <input id='patient-ipr' type='checkbox' />
                            <span className='checkbox'></span>
                        </label>
                    </div>
                    <label htmlFor='ipr-details'>IPR Details</label>
                    <input id='ipr-details' type='text' />
                </div>
                <div className='patient-detials-input-fields'>
                    <span className='mb-2 sub-heading'>Any Restriction on Attachments*</span>
                    <div className='arches-container'>
                        <label htmlFor='no-restriction' className='checkbox-container'>
                            No Restriction
                            <input id='no-restriction' type='checkbox' />
                            <span className='checkbox'></span>
                        </label>
                        <label htmlFor='selective-attachments' className='checkbox-container'>
                            Selective attachments
                            <input id='selective-attachments' type='checkbox' />
                            <span className='checkbox'></span>
                        </label>
                        <label htmlFor='patient-attachments' className='checkbox-container'>
                            No attachments
                            <input id='patient-attachments' type='checkbox' />
                            <span className='checkbox'></span>
                        </label>
                    </div>
                    <label htmlFor='attachments-details'>Attachment Details</label>
                    <input id='attachments-details' type='text' />
                </div>

                <div className='patient-detials-input-fields gap-8 sub-heading'>
                    <label htmlFor='others'>Any other details</label>
                    <input id='others' type='text'></input>
                </div>
            </div>
        </div>
    );
}

export default TreatmentGoal;
