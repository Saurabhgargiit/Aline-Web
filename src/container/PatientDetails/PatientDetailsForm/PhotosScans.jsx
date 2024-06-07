import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AWS from 'aws-sdk';

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

AWS.config.region = process.env.REACT_APP_S3_REGION;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.REACT_APP_S3_IDENTITY_POOL_ID,
});

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: { Bucket: process.env.REACT_APP_S3_BUCKET },
});

function PhotosScans({ isEdit }) {
    const [formValues, setFormValues] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);

    const { patientID } = useParams();

    const handleFileChange = (key, event) => {
        console.log(key, event);
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormValues((prev) => ({ ...prev, [key]: e.target.result }));
                setSelectedFile({ file: file, key: key });
            };
            reader.readAsDataURL(file);
            console.log(reader);
        }
    };

    const uploadFile = (label) => {
        if (!selectedFile) return;

        const key = `${patientID}/${label}-${Date.now()}-${selectedFile.file.name}`;
        const upload = new AWS.S3.ManagedUpload({
            params: {
                Bucket: s3.config.params.Bucket,
                Key: key,
                Body: selectedFile.file,
                ContentDisposition: 'inline',
                ContentType: selectedFile.file.type,
            },
        });

        const promise = upload.promise();

        promise.then(
            function (data) {
                console.log('Successfully uploaded file:', data);
                alert('Successfully uploaded file.');
                // setSelectedFile(null); // Clear selection after upload
            },
            function (err) {
                console.error('There was an error uploading your file: ', err.message);
                alert('Error uploading file: ' + err.message);
            }
        );
    };

    const clearFile = (key) => {
        // if (!selectedFile || !formValues[key]) return;

        // Construct the S3 object key
        const s3Key = `${patientID}/${key}-${selectedFile.file.name}`;
        const deleteParams = {
            Bucket: s3.config.params.Bucket,
            Key: s3Key,
        };
        s3.deleteObject(deleteParams, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                alert('Failed to delete the image from S3.');
            } else {
                console.log(data); // successful response
                alert('Image successfully deleted from S3.');
                setFormValues((prev) => ({ ...prev, [key]: '' }));
                setSelectedFile(null);
            }
        });
        // setFormValues((prev) => ({ ...prev, [key]: '' }));
        // selectedFile(null);
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
                                        disabled={formValues[key] !== undefined}
                                    />
                                    {formValues[key] && (
                                        <>
                                            <img
                                                src={formValues[key]}
                                                alt={label}
                                                style={{ width: '100px', height: '100px' }}
                                            />
                                            <button onClick={() => clearFile(key)}>Remove</button>
                                            <button
                                                onClick={() => uploadFile(key)}
                                                disabled={!selectedFile}
                                            >
                                                Upload
                                            </button>
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
