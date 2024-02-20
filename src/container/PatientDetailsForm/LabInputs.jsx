import React, { useState } from 'react';

function LabInputs() {
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
          <label htmlFor='upper-aligner-sets-no'>No. of Aligner Sets-Upper</label>
          <input id='upper-aligner-sets-no' type='number'></input>
        </div>
        <div className='patient-detials-input-fields'>
          <label htmlFor='lpper-aligner-sets-no'>No. of Aligner Sets-Lower</label>
          <input id='lpper-aligner-sets-no' type='number' value={id} />
        </div>
        <div className='patient-detials-input-fields'>
          <label htmlFor='no-of-ipr-done'>IPR done before Stage(s)</label>
          <input id='no-of-ipr-done' type='number' value={name} onChange={nameChangeHandler} />
        </div>
        <div className='patient-detials-input-fields'>
          <label htmlFor='no-of-attachment-put'>Attachments put before stage(s)</label>
          <input id='no-of-attachment-put' type='number'></input>
        </div>
        <div className='patient-detials-input-fields'>
          <label htmlFor='ipr-report'>IPR Report</label>
          <input id='ipr-report' type='text'></input>
        </div>
        <div className='patient-detials-input-fields'>
          <label htmlFor='transformation-video'>Transformation Video</label>
          <input id='transformation-video' type='date'></input>
        </div>
      </div>
    </div>
  );
}

export default LabInputs;
