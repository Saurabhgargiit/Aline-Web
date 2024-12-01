// MultipleImagesUploader.js

import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { toast } from 'react-toastify';

import ImgViewer from '../ImgViewer/ImgViewer';
import Button from '../Button/Button';

import { uploadToS3 } from '../../utils/aws';
import { sanitizeFileName } from '../../utils/commonfunctions/commonfunctions';

import { ReactComponent as UploadIcon } from '../../assets/icons/upload.svg';
import { ReactComponent as CloudUploadIcon } from '../../assets/icons/cloud-upload.svg';
import { ReactComponent as CrossIcon } from '../../assets/icons/cross.svg';
import { ReactComponent as DownloadIcon } from '../../assets/icons/download.svg';

import './SingleImageUploader.scss';

function MultipleImagesUploader({
  label,
  labelkey,
  fileTypeRestrictions,
  patientID,
  rebootID,
  existingFiles,
  onFilesUpload,
  isEdit,
  imgClickHandler,
}) {
  const [formValues, setFormValues] = useState([]); // Array of { file: File }
  const [selectedFiles, setSelectedFiles] = useState(existingFiles || []); // Array of { url: '', key: '' }
  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    if (existingFiles) {
      setSelectedFiles(existingFiles);
    }
  }, [existingFiles]);

  // Handle file selection
  const handleFilesChange = (event) => {
    const files = Array.from(event.target.files);
    const newFormValues = files.map((file) => ({ file }));
    setFormValues((prev) => [...prev, ...newFormValues]);
  };

  // Upload files to S3
  const uploadFiles = async () => {
    if (formValues.length === 0) return;

    try {
      setLoadingStatus(true);
      const uploadedFiles = [];

      for (const { file } of formValues) {
        const sanitizedFileName = sanitizeFileName(file.name);
        const photoKey = `${patientID}/reboot${rebootID}/${labelkey}-${Date.now()}-${sanitizedFileName}`;
        const { Location, Key } = await uploadToS3(photoKey, file);
        uploadedFiles.push({ url: Location, key: Key });
      }

      setSelectedFiles((prev) => [...prev, ...uploadedFiles]);
      setFormValues([]);
      onFilesUpload({ [labelkey]: [...selectedFiles, ...uploadedFiles] });
    } catch (err) {
      console.error('There was an error uploading your files: ', err.message);
      toast.error(`There was an error uploading your files: ${err.message}`, {
        position: 'top-right',
        hideProgressBar: false,
        autoClose: 2000,
        closeOnClick: true,
        theme: 'light',
      });
    } finally {
      setLoadingStatus(false);
    }
  };

  // Clear a selected file
  const clearFile = (index, isUploaded) => {
    if (isUploaded) {
      const updatedSelectedFiles = selectedFiles.filter(
        (_, idx) => idx !== index
      );
      setSelectedFiles(updatedSelectedFiles);
      onFilesUpload({ [labelkey]: updatedSelectedFiles });
    } else {
      const updatedFormValues = formValues.filter((_, idx) => idx !== index);
      setFormValues(updatedFormValues);
    }
  };

  // Handle file download
  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const dataExists = formValues.length > 0 || selectedFiles.length > 0;
  const uploadNotDone = formValues.length > 0;

  return (
    <div className="multiple-images-uploader">
      <label htmlFor={labelkey}>{label}</label>
      {isEdit ? (
        <>
          <input
            id={`file-input-${labelkey}`}
            type="file"
            accept={fileTypeRestrictions}
            multiple
            onChange={handleFilesChange}
          />
          <label htmlFor={`file-input-${labelkey}`} className="upload-label">
            <OverlayTrigger
              key={`file-input-${labelkey}-tooltip`}
              placement={'top'}
              overlay={
                <Tooltip id={`file-input-${labelkey}-tooltip`}>
                  {`Add ${labelkey === 'scans' ? 'Scans' : 'Photos'}`}
                </Tooltip>
              }
            >
              <UploadIcon />
            </OverlayTrigger>
          </label>
          <div className="files-preview">
            {selectedFiles.map((file, index) => (
              <div key={`selected-${index}`} className="file-container">
                {labelkey !== 'scans' ? (
                  <>
                    <ImgViewer
                      src={file.url}
                      alt={`${label} ${index + 1}`}
                      loading={loadingStatus}
                      onClick={() => {
                        imgClickHandler(index);
                      }}
                    />
                    <Button
                      onClickCallBk={() => clearFile(index, true)}
                      svg={<CrossIcon />}
                      tooltip={`Remove ${label} ${index + 1}`}
                      ariaLabel={`Remove ${label} ${index + 1}`}
                      postionClass="fit-content"
                    />
                  </>
                ) : (
                  <>
                    <div className="file-info">
                      <span>{`Scan ${index + 1}`}</span>
                      <Button
                        onClickCallBk={() =>
                          handleDownload(file.url, `Scan_${index + 1}.zip`)
                        }
                        svg={<DownloadIcon />}
                        tooltip={`Download Scan ${index + 1}`}
                        ariaLabel={`Download Scan ${index + 1}`}
                        postionClass="fit-content"
                      />
                    </div>
                    <Button
                      onClickCallBk={() => clearFile(index, true)}
                      svg={<CrossIcon />}
                      tooltip={`Remove Scan ${index + 1}`}
                      ariaLabel={`Remove Scan ${index + 1}`}
                      postionClass="fit-content"
                    />
                  </>
                )}
              </div>
            ))}
            {formValues.map((fileObj, index) => (
              <div key={`form-${index}`} className="file-container">
                {labelkey !== 'scans' ? (
                  <>
                    <ImgViewer
                      src={URL.createObjectURL(fileObj.file)}
                      alt={`${label} ${selectedFiles.length + index + 1}`}
                      loading={loadingStatus}
                    />
                    <Button
                      onClickCallBk={() => clearFile(index, false)}
                      svg={<CrossIcon />}
                      tooltip={`Remove ${label} ${
                        selectedFiles.length + index + 1
                      }`}
                      ariaLabel={`Remove ${label} ${
                        selectedFiles.length + index + 1
                      }`}
                      postionClass="fit-content"
                    />
                  </>
                ) : (
                  <>
                    <div className="file-info">
                      <span>{fileObj.file.name}</span>
                    </div>
                    <Button
                      onClickCallBk={() => clearFile(index, false)}
                      svg={<CrossIcon />}
                      tooltip={`Remove ${fileObj.file.name}`}
                      ariaLabel={`Remove ${fileObj.file.name}`}
                      postionClass="fit-content"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
          {uploadNotDone && (
            <Button
              onClickCallBk={uploadFiles}
              svg={<CloudUploadIcon />}
              tooltip={`Upload to Cloud`}
              ariaLabel={`Upload to Cloud`}
              postionClass="fit-content"
            />
          )}
        </>
      ) : (
        <>
          {selectedFiles.length > 0 ? (
            <div className="files-preview">
              {selectedFiles.map((file, index) => (
                <div key={`selected-${index}`} className="file-container">
                  {labelkey !== 'scans' ? (
                    <>
                      <ImgViewer
                        src={file.url}
                        alt={`${label} ${index + 1}`}
                        loading={loadingStatus}
                        onClick={() => {
                          imgClickHandler(index);
                        }}
                      />
                      <Button
                        onClickCallBk={() =>
                          handleDownload(file.url, `${label}_${index + 1}.jpg`)
                        }
                        svg={<DownloadIcon />}
                        tooltip={`Download ${label} ${index + 1}`}
                        ariaLabel={`Download ${label} ${index + 1}`}
                        postionClass="fit-content"
                      />
                    </>
                  ) : (
                    <>
                      <div className="file-info">
                        <span>{`Scan ${index + 1}`}</span>
                        <Button
                          onClickCallBk={() =>
                            handleDownload(file.url, `Scan_${index + 1}.zip`)
                          }
                          svg={<DownloadIcon />}
                          tooltip={`Download Scan ${index + 1}`}
                          ariaLabel={`Download Scan ${index + 1}`}
                          postionClass="fit-content"
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div>No {labelkey === 'scans' ? 'Scans' : 'Photos'} available</div>
          )}
        </>
      )}
    </div>
  );
}

export default MultipleImagesUploader;
