import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AWS from 'aws-sdk';

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
    const [selectedFiles, setSelectedFiles] = useState({});

    const { patientID } = useParams();

    const labels = {
        profilePhoto: 'Profile Photo',
        extFront: 'Face Front',
        extSide: 'Face Side',
        extOblique: 'Face Oblique',
        intFront: 'Teeth Front',
        intSideLeft: 'Teeth Side Left',
        intFrontRight: 'Teeth Front Right',
        intMaxilla: 'Maxilla',
        intMandible: 'Mandible',
        opg: 'OPG',
        cep: 'Cephalogram',
        scans: 'Scans',
    };

    const fileTypeRestrictions = {
        scans: '.zip,.7z',
        default: 'image/jpeg,image/png,image/gif,image/jpg',
    };

    const handleFileChange = (key, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                console.log(e);
                console.log(e.target.result);
                setFormValues((prev) => ({ ...prev, [key]: { res: e.target.result, file } }));
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadFile = (label) => {
        const files = formValues[label];
        if (!files.file) return;

        const key = `${patientID}/${label}-${Date.now()}-${files.file.name}`;
        const upload = new AWS.S3.ManagedUpload({
            params: {
                Bucket: s3.config.params.Bucket,
                Key: key,
                Body: files.file,
                ContentDisposition: 'inline',
                ContentType: files.file.type,
            },
        });

        const promise = upload.promise();

        promise.then(
            function (data) {
                const { Location, key } = data;
                setSelectedFiles((prev) => ({ ...prev, [label]: { url: Location, key: key } }));
                console.log('Successfully uploaded file:', data);
            },
            function (err) {
                console.error('There was an error uploading your file: ', err.message);
                alert('Error uploading file: ' + err.message);
            }
        );
    };

    const submitHandler = () => {
        //post selectedFiles to backend
    };

    const clearFile = (key) => {
        const readFiles = formValues[key];
        const uploadedFile = selectedFiles[key];

        // Check if there is anything to clear
        if (!readFiles?.file && !uploadedFile?.url) return;

        // Update formValues if there's a file to remove
        if (readFiles?.file) {
            setFormValues((prev) => {
                const tempFormValues = { ...prev };
                delete tempFormValues[key];
                return tempFormValues;
            });
        }

        // Update selectedFiles if there's a URL to remove
        if (uploadedFile?.url) {
            setSelectedFiles((prev) => {
                const tempSelectedFiles = { ...prev };
                delete tempSelectedFiles[key];
                return tempSelectedFiles;
            });
        }
    };

    return (
        <div className='patientAddEditTopContainer'>
            <div className='patientAddEditContainer'>
                {Object.entries(labels).map(([key, label]) => {
                    const fileInputType =
                        key === 'scans'
                            ? fileTypeRestrictions['scans']
                            : fileTypeRestrictions['default'];
                    const uploadedFile = formValues[key];
                    const selectedFile = selectedFiles[key];

                    //data exists or not
                    const dataExists = uploadedFile?.res || selectedFile?.url;

                    //file added on browser but not uploaded to S3
                    const uploadNotDone = uploadedFile?.res && !selectedFile?.url;

                    return (
                        <div className='patient-detials-input-fields'>
                            <label htmlFor={key}>{label}</label>
                            {isEdit ? (
                                <>
                                    {!dataExists && (
                                        <input
                                            id={key}
                                            type='file'
                                            accept={fileInputType}
                                            onChange={(e) => handleFileChange(key, e)}
                                            disabled={
                                                formValues[key] &&
                                                JSON.stringify(formValues[key]) !== '{}'
                                            }
                                        />
                                    )}
                                    {dataExists && (
                                        <>
                                            <img
                                                src={selectedFile?.url ?? uploadedFile?.res}
                                                alt={label}
                                                style={{ height: '100px' }}
                                            />
                                            <button onClick={() => clearFile(key)}>Remove</button>
                                        </>
                                    )}
                                    {uploadNotDone && (
                                        <button
                                            onClick={() => uploadFile(key)}
                                            disabled={!selectedFiles}
                                        >
                                            Upload
                                        </button>
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
