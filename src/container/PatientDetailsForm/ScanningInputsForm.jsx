import React, { useState } from 'react';

function ScanningInputsForm() {
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
          <label htmlFor='scanning-date'>Date of Scanning*</label>
          <input id='scanning-date' type='date'></input>
        </div>
        <div className='patient-detials-input-fields'>
          <label htmlFor='patient-id'>Patient Id*</label>
          <input id='patient-id' type='text' value={id} />
        </div>
        <div className='patient-detials-input-fields'>
          <label htmlFor='patient-name'>Patient Name*</label>
          <input id='patient-name' type='text' value={name} onChange={nameChangeHandler} />
        </div>
        <div className='patient-detials-input-fields'>
          <label>Patient Photo</label>
          <input type='img'></input>
        </div>
        <div className='patient-detials-input-fields'>
          <label htmlFor='notes-for-case'>Notes for case</label>
          <input id='notes-for-case' type='text'></input>
        </div>
        <div className='patient-detials-input-fields'>
          <div>Status</div>
          <div>
            <div>Complete</div>
            <div>Open</div>
          </div>
        </div>
        <div className='patient-detials-input-fields'>
          <label htmlFor='date-of-reboot-scan'>Date of Reboot Scan*</label>
          <input id='date-of-reboot-scan' type='date'></input>
        </div>
      </div>
    </div>
  );
}

export default ScanningInputsForm;
