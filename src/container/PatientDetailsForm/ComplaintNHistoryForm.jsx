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
                    <div className='checkbox-container'>
                        <label htmlFor='crown-bridges'>Crown/Bridges</label>
                        <input id='crown-bridges' type='checkbox' className='checkbox' />
                    </div>
                    <label htmlFor='crown-bridges-details'>If Yes, Details</label>
                    <input id='crown-bridges-details' type='text' disabled />
                </div>
                <div className='patient-detials-input-fields'>
                    <label htmlFor='implants'>Implants</label>
                    <input id='implants' type='checkbox' />
                    <label htmlFor='implants-details'>If Yes, Details</label>
                    <input id='implants-details' type='text' disabled />
                </div>
                <div className='patient-detials-input-fields'>
                    <label htmlFor='veneers'>Veneers</label>
                    <input id='veneers' type='checkbox' />
                    <label htmlFor='veneers-details'>If Yes, Details</label>
                    <input id='veneers-details' type='text' disabled />
                </div>
                Others
                <div className='patient-detials-input-fields'>
                    <label htmlFor='previous-treat'>Previous Orthodontic Treatment</label>
                    <input id='previous-treat' type='checkbox' />
                    <label htmlFor='previous-treat-details'>If Yes, Details</label>
                    <input id='previous-treat-details' type='text' disabled />
                </div>
                <div className='patient-detials-input-fields'>
                    <label htmlFor='composites'>Composites/Buildup</label>
                    <input id='composites' type='checkbox' />
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
