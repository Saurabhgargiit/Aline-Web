import React, { useState } from 'react';
import { uploadToS3 } from '../../utils/aws';
import PDFViewer from '../PDFViewer/PDFViewer';
import Button from '../Button/Button';

import { ReactComponent as AttachmentIcon } from '../../assets/icons/attachment.svg';
import { ReactComponent as RemoveIcon } from '../../assets/icons/cross.svg';
import { ReactComponent as UploadIcon } from '../../assets/icons/send.svg';

import './FileUploader.scss';


const fileTypeRestrictions = {
    pdf: 'application/pdf',
    video: 'video/mp4,video/x-m4v,video/*',
    image: 'image/jpeg,image/png,image/gif,image/jpg',
    zip: 'application/zip,application/x-zip-compressed,multipart/x-zip,application/7z,.zip,.7z',
};

const FileUploader = ({ label, fileType, onUploadComplete, patientID, styleClassName }) => {
    const [fileData, setFileData] = useState({ res: '', file: null });
    const [uploadedFile, setUploadedFile] = useState({ url: '', key: '' });
    console.log(patientID)
    const className = 'fileUploader ' + styleClassName;

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFileData({ res: e.target.result, file });
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadFile = async () => {
        if (!fileData.file) return;

        const fileKey = `${patientID}/${label}-${Date.now()}-${fileData.file.name}`;

        try {
            const { Location, key } = await uploadToS3(fileKey, fileData.file);
            setUploadedFile({ url: Location, key });
            setFileData({ res: '', file: null });

            // Call the callback function to notify parent component about the upload
            if (onUploadComplete) {
                onUploadComplete({ url: Location, key });
            }
        } catch (err) {
            console.error('There was an error uploading your file: ', err.message);
            alert('There was an error uploading your file: ', err.message);
        }
    };

    const clearFile = () => {
        setFileData({ res: '', file: null });
        setUploadedFile({ url: '', key: '' });
    };

    const renderPreview = () => {
        if (fileType === 'video') {
            return (
                <video controls className="video-container" src={fileData.res || uploadedFile.url} />
            );
        } else if (fileType === 'pdf') {
            return <PDFViewer styleClassName={''} pdfFile={fileData.res || uploadedFile.url} />;
        } else if (fileType === 'image') {
            return <img src={fileData.res || uploadedFile.url} alt="Uploaded" className="image-preview" />;
        } else if (fileType === 'zip') {
            return <p>{uploadedFile.url ? `Uploaded: ${uploadedFile.url}` : `Selected: ${fileData.file?.name}`}</p>;
        }
        return null;
    };

    return (
        <div className={className}>
            {!fileData.res && !uploadedFile.url && (
                <input
                    type="file"
                    accept={fileTypeRestrictions[fileType] || fileTypeRestrictions.default}
                    onChange={handleFileChange}
                />
            )}
            {(fileData.res || uploadedFile.url) && renderPreview() }
            <div className='buttons'>
                {/* {(fileData.res || uploadedFile.url) && <Button onClickCallBk={clearFile} svg={<RemoveIcon/>} tooltip='Remove File' ariaLabel='Remove File' className='fileUploadButton'/>} */}
                {(fileData.res || uploadedFile.url) && <Button onClickCallBk={clearFile} title={'Remove File'} ariaLabel='Remove File' postionClass='pt-3'/>}
                {fileData.res && (
                    // <Button onClickCallBk={uploadFile} svg={<UploadIcon/>} tooltip='Upload File' ariaLabel='Upload File'  className='fileUploadButton'/>
                    <Button onClickCallBk={uploadFile} title='Upload File' postionClass='pt-3' type='primary'/>
                )}
            </div>
        </div>
    );
};

export default FileUploader;
