import React, { useState } from 'react';

const labels = {
    profilePhoto: 'Profile Photo',
    extraFront: 'Face Front',
    extraSide: 'Face Side',
    extraOblique: 'Face Oblique',
    intraFront: 'Teeth Front',
    intraSideLeft: 'Teeth Side Left',
    intraFrontRight: 'Teeth Front Right',
    intraMaxilla: 'Maxilla',
    intraMandible: 'Mandible',
    opg: 'OPG',
    cep: 'Cephalogram',
    scans: 'Scans',
};

const fileTypeRestrictions = {
    scans: '.zip,.7z',
    default: 'image/jpeg,image/png,image/gif,image/jpg',
};

// const init = () => {
//     const obj = {};
//     Object.keys(labels).forEach((el) => {
//         obj[el + 'IMG'] = '';
//     });
//     return obj;
// };

function PhotosScans({ isEdit }) {
    const [formValues, setFormValues] = useState({});

    const handleFileChange = (key, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormValues((prev) => ({ ...prev, [key]: e.target.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const clearFile = (key) => {
        setFormValues((prev) => ({ ...prev, [key]: '' }));
    };

    return (
        <div className='patientAddEditTopContainer'>
            <div className='patientAddEditContainer'>
                {Object.entries(labels).map(([key, label]) => {
                    const fileInputType =
                        key === 'scans'
                            ? fileTypeRestrictions['scans']
                            : fileTypeRestrictions['default'];

                    return (
                        <div className='patient-detials-input-fields'>
                            <label htmlFor={key}>{label}</label>
                            {isEdit ? (
                                <>
                                    <input
                                        id={key}
                                        type='file'
                                        accept={fileInputType}
                                        onChange={(e) => handleFileChange(key, e)}
                                    />
                                    {formValues[key] && (
                                        <>
                                            <img
                                                src={formValues[key]}
                                                alt={label}
                                                style={{ width: '100px', height: '100px' }}
                                            />
                                            <button onClick={() => clearFile(key)}>Clear</button>
                                        </>
                                    )}
                                </>
                            ) : (
                                formValues[key] && <img src={formValues[key]} alt={label} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default PhotosScans;
