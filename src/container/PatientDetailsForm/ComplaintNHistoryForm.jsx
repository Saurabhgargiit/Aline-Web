import React, { useState } from 'react';

function ComplaintNHistoryForm() {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const nameChangeHandler = (e) => {
        const value = e.target.value;
        setName(() => value);
    };
    return (
        <div className='patientAddEditTopContainer'>
            <div className='patientAddEditContainer'>
                <div className='patient-detials-input-fields'>
                    <label htmlFor='chief-complaint'>Chief Complaint*</label>
                    <input id='chief-complaint' type='text'></input>
                </div>
                <div className='font600 center-position heading'>
                    <span>~~~~~~~~~~~~~~~~~~~~Previous Dental History~~~~~~~~~~~~~~~~~~~~</span>
                </div>
                <div className='patient-detials-input-fields'>
                    <label htmlFor='crown-bridges' className='checkbox-container'>
                        Crown/Bridges
                        <input id='crown-bridges' type='checkbox' />
                        <span className='checkbox'></span>
                    </label>
                    <label htmlFor='crown-bridges-details'>If Yes, Details</label>
                    <input id='crown-bridges-details' type='text' disabled />
                </div>
                <div className='patient-detials-input-fields'>
                    <label htmlFor='implants' className='checkbox-container'>
                        Implants
                        <input id='implants' type='checkbox' />
                        <span className='checkbox'></span>
                    </label>
                    <label htmlFor='implants-details'>If Yes, Details</label>
                    <input id='implants-details' type='text' disabled />
                </div>
                <div className='patient-detials-input-fields'>
                    <label htmlFor='veneers' className='checkbox-container'>
                        Veneers
                        <input id='veneers' type='checkbox' />
                        <span className='checkbox'></span>
                    </label>
                    <label htmlFor='veneers-details'>If Yes, Details</label>
                    <input id='veneers-details' type='text' disabled />
                </div>
                <div className='patient-detials-input-fields'>
                    <label htmlFor='previous-treat' className='checkbox-container'>
                        Previous Orthodontic Treatment
                        <input id='previous-treat' type='checkbox' />
                        <span className='checkbox'></span>
                    </label>
                    <label htmlFor='previous-treat-details'>If Yes, Details</label>
                    <input id='previous-treat-details' type='text' disabled />
                </div>
                <div className='patient-detials-input-fields'>
                    <label htmlFor='composites' className='checkbox-container'>
                        Composites/Buildup
                        <input id='composites' type='checkbox' />
                        <span className='checkbox'></span>
                    </label>
                    <label htmlFor='composites-details'>If Yes, Details</label>
                    <input id='composites-details' type='text' disabled />
                </div>
                <div className='patient-detials-input-fields'>
                    <label htmlFor='others'>Others</label>
                    <input id='others' type='text'></input>
                </div>
            </div>
        </div>
    );
}

export default ComplaintNHistoryForm;
