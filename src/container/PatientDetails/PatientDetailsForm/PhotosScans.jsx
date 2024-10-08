import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast, Bounce } from 'react-toastify';

import Button from '../../../components/Button/Button';

import { uploadToS3 } from '../../../utils/aws';
import { putCall } from '../../../utils/commonfunctions/apicallactions';

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

const initState = (obj, value) => {
    const initialState = {};
    Object.keys(obj).forEach((label) => {
        initialState[label] = value;
    });
    return initialState;
};

function PhotosScans({
    isEdit,
    formData,
    cancelFlag,
    getPhotosScans,
    setIsEdit,
    setIsLoading,
    cancelHandler,
    rebootID
}) {
    const [formValues, setFormValues] = useState({});
    const [selectedFiles, setSelectedFiles] = useState(initState(labels, [{ url: '', key: '' }]));

    const { patientID } = useParams();

    const fileTypeRestrictions = {
        scans: '.zip,.7z',
        default: 'image/jpeg,image/png,image/gif,image/jpg',
    };

    //file upload to browser input element
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

    //upload to S3
    const uploadFile = async (label) => {
        const files = formValues[label];
        if (!files.file) return;

        const photoKey = `${patientID}/reboot${rebootID}/${label}-${Date.now()}-${files.file.name}`;

        try {
            const { Location, key } = await uploadToS3(photoKey, files.file);
            setSelectedFiles((prev) => ({ ...prev, [label]: [{ url: Location, key: key }] }));
            setFormValues((prev) => {
                const tempFormValues = { ...prev };
                delete tempFormValues[label];
                return tempFormValues;
            });
            console.log('Successfully uploaded file:', Location);
        } catch (err) {
            console.error('There was an error uploading your file: ', err.message);
            alert('There was an error uploading your file: ', err.message);
        }
    };

    const submitHandler = () => {
        //post selectedFiles to backend
        const payload = { ...selectedFiles };
        payload['patientID'] = patientID;

        putCall(payload, 'ADD_URLS_TO_DATABASE', []).then((data) => {
            if (data.result === 'success') {
                toast.success(`Photos & Scans modified successully.`, {
                    position: 'top-right',
                    hideProgressBar: false,
                    autoClose: 2000,
                    closeOnClick: true,
                    // pauseOnHover: true,
                    theme: 'light',
                    transition: Bounce,
                });
                setIsLoading(true);
                getPhotosScans(patientID);
                setIsEdit(false);
            } else if (data.result === 'error') {
                toast.error(data.error ?? 'data.error', {
                    position: 'top-right',
                    hideProgressBar: false,
                    autoClose: 2000,
                    closeOnClick: true,
                    // pauseOnHover: true,
                    theme: 'light',
                    transition: Bounce,
                });
            }
            // setLoading(false);
        });
    };

    const clearFile = (key) => {
        const readFiles = formValues[key];
        const uploadedFile = selectedFiles[key];

        // Check if there is anything to clear
        if (!readFiles?.file && !uploadedFile[0]?.url) return;

        // Update formValues if there's a file to remove
        if (readFiles?.file) {
            setFormValues((prev) => {
                const tempFormValues = { ...prev };
                delete tempFormValues[key];
                return tempFormValues;
            });
        }

        // Update selectedFiles if there's a URL to remove
        if (uploadedFile[0]?.url) {
            setSelectedFiles((prev) => {
                return { ...prev, [key]: [{ url: '', key: '' }] };
            });
        }
    };

    //Effect hook to update state when the formData prop changes
    useEffect(() => {
        if (Object.keys(formData).length !== 0) {
            // setFormValues(formData);
            setSelectedFiles(formData);
        }
    }, [formData, cancelFlag]);

    return (
        <div className='patientAddEditTopContainer'>
            <div className='patientAddEditContainer'>
                {Object.entries(labels).map(([key, label]) => {
                    const fileInputType =
                        key === 'scans'
                            ? fileTypeRestrictions['scans']
                            : fileTypeRestrictions['default'];
                    //below is data of file uploaded to input element of browser
                    const uploadedFile = formValues[key];

                    //below is url of S3 uploaded file or url received from backend
                    const selectedFile = selectedFiles[key];

                    //data exists or not
                    const dataExists = uploadedFile?.res || selectedFile[0]?.url;

                    //file added on browser but not uploaded to S3
                    const uploadNotDone = uploadedFile?.res;

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
                                        />
                                    )}
                                    {dataExists && (
                                        <>
                                            {key !== 'scans' ? (
                                                <img
                                                    src={uploadedFile?.res || selectedFile[0]?.url}
                                                    alt={label}
                                                    style={{ height: '100px' }}
                                                />
                                            ) : (
                                                <a
                                                    href={uploadedFile?.res || selectedFile[0]?.url}
                                                    download
                                                >
                                                    Download Scan
                                                </a>
                                            )}
                                            <button onClick={() => clearFile(key)}>Remove</button>
                                        </>
                                    )}
                                    {uploadNotDone && (
                                        <button
                                            onClick={() => uploadFile(key)}
                                            // disabled={!selectedFiles}
                                        >
                                            Upload
                                        </button>
                                    )}
                                </>
                            ) : (
                                <>
                                    {key !== 'scans' &&
                                        (selectedFile[0]?.url ? (
                                            <img
                                                src={selectedFile[0]?.url}
                                                alt={label}
                                                style={{ height: '100px' }}
                                            />
                                        ) : (
                                            <div>No Photo available</div>
                                        ))}
                                    {key === 'scans' && (
                                        <a href={selectedFile[0]?.url} download>
                                            Download Scan
                                        </a>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
                <div className='buttons pt-4'>
                    <Button
                        postionClass='mx-5'
                        className={!isEdit ? 'noVisible' : ''}
                        title='Cancel'
                        onClickCallBk={cancelHandler}
                    />
                    <Button
                        postionClass='mx-5'
                        className={!isEdit ? 'noVisible' : ''}
                        title='Save'
                        type='primary'
                        onClickCallBk={submitHandler}
                    />
                </div>
            </div>
        </div>
    );
}

export default PhotosScans;
