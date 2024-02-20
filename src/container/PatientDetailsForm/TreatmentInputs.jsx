import React, { useState } from 'react';

function TreatmentInputs() {
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
          <label htmlFor='treatment-notes'>Treatment Notes-IPR,attachement,others</label>
          <input id='treatment-notes' type='text'></input>
        </div>
        <div className='patient-detials-input-fields'>
          <label htmlFor='notes-on-aligner-set'>Notes on aligner set with patient</label>
          <input id='notes-on-aligner-set' type='text' value={id} />
        </div>
        <div className='patient-detials-input-fields'>
          <label htmlFor='patient-name'>Patient progress</label>
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
          <label htmlFor='date-of-recent-scan'>Date of most recent scan</label>
          <input id='date-of-recent-scan' type='date'></input>
        </div>
      </div>
    </div>
  );
}

export default TreatmentInputs;
