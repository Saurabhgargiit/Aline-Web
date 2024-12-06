import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { toast } from 'react-toastify';

import ImgViewer from '../ImgViewer/ImgViewer';
import Button from '../Button/Button';

import { uploadToS3 } from '../../utils/aws';
import { sanitizeFileName } from '../../utils/commonfunctions/commonfunctions';

import { ReactComponent as DownloadIcon } from '../../assets/icons/download.svg';
import { ReactComponent as UploadIcon } from '../../assets/icons/upload.svg';
import { ReactComponent as CloudUploadIcon } from '../../assets/icons/cloud-upload.svg';
import { ReactComponent as CrossIcon } from '../../assets/icons/cross.svg';

import './SingleImageUploader.scss';

function SingleImageUploader({
  label,
  labelkey,
  fileTypeRestrictions,
  patientID,
  rebootID,
  existingFile,
  onFileUpload,
  isEdit,
  imgClickHandler,
}) {
  const [formValue, setFormValue] = useState({ res: '', file: null });
  const [selectedFile, setSelectedFile] = useState(
    existingFile || { url: '', key: '' }
  );
  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    if (existingFile) {
      setSelectedFile(existingFile);
    }
  }, [existingFile]);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormValue({ res: '', file });
    }
  };

  // Upload file to S3
  const uploadFile = async () => {
    const { file } = formValue;
    if (!file) return;

    const sanitizedFileName = sanitizeFileName(file.name);
    const photoKey = `${patientID}/reboot${rebootID}/${labelkey}-${Date.now()}-${sanitizedFileName}`;

    try {
      setLoadingStatus(true);
      const { Location, Key } = await uploadToS3(photoKey, file);
      setSelectedFile({ url: Location, key: Key });
      setFormValue({ res: '', file: null });
      onFileUpload({ [labelkey]: [{ url: Location, key: Key }] });
    } catch (err) {
      console.error('There was an error uploading your file: ', err.message);
      toast.error(`There was an error uploading your file: ${err.message}`, {
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

  // Clear selected file
  const clearFile = () => {
    if (!formValue.file && !selectedFile.url) return;

    if (formValue.file) {
      setFormValue({ res: '', file: null });
    }

    if (selectedFile.url) {
      setSelectedFile({ url: '', key: '' });
      onFileUpload({ [labelkey]: [{ url: '', key: '' }] });
    }
  };

  // Handle file download
  const handleDownload = () => {
    const url = selectedFile.url;
    const filename = `${label}.${labelkey === 'scans' ? 'zip' : 'jpg'}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `file.${labelkey === 'scans' ? 'zip' : 'jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const dataExists = formValue.file || selectedFile.url;
  const uploadNotDone = formValue.file;

  return (
    <div className="single-image-uploader">
      <label htmlFor={labelkey}>{label}</label>
      {isEdit ? (
        <>
          {!dataExists && (
            <>
              <input
                id={`file-input-${labelkey}`}
                type="file"
                accept={fileTypeRestrictions}
                onChange={handleFileChange}
              />
              <label
                htmlFor={`file-input-${labelkey}`}
                className="upload-label"
              >
                <OverlayTrigger
                  key={`file-input-${labelkey}-tooltip`}
                  placement={'top'}
                  overlay={
                    <Tooltip id={`file-input-${labelkey}-tooltip`}>
                      {`Upload ${labelkey === 'scans' ? 'Scan' : 'Photo'}`}
                    </Tooltip>
                  }
                >
                  <UploadIcon />
                </OverlayTrigger>
              </label>
            </>
          )}
          {dataExists && (
            <>
              {labelkey !== 'scans' ? (
                <div>
                  <ImgViewer
                    src={
                      formValue.file
                        ? URL.createObjectURL(formValue.file)
                        : selectedFile.url
                    }
                    alt={label}
                    loading={loadingStatus}
                    onClick={() => {
                      imgClickHandler();
                    }}
                  />
                  <Button
                    onClickCallBk={clearFile}
                    svg={<CrossIcon />}
                    tooltip={`Remove ${label}`}
                    ariaLabel={`Remove ${label}`}
                    postionClass="fit-content"
                  />
                </div>
              ) : (
                <div>
                  <div className="file-info">
                    <span>{formValue.file?.name || 'Scan uploaded'}</span>
                  </div>
                  <Button
                    onClickCallBk={clearFile}
                    svg={<CrossIcon />}
                    tooltip={`Remove ${label}`}
                    ariaLabel={`Remove ${label}`}
                    postionClass="fit-content"
                  />
                </div>
              )}
            </>
          )}
          {uploadNotDone && (
            <Button
              onClickCallBk={uploadFile}
              svg={<CloudUploadIcon />}
              tooltip={`Upload ${label}`}
              ariaLabel={`Upload ${label}`}
              postionClass="fit-content"
            />
          )}
        </>
      ) : (
        <>
          {selectedFile.url ? (
            <>
              {labelkey !== 'scans' ? (
                <div>
                  <ImgViewer
                    src={selectedFile.url}
                    alt={label}
                    loading={loadingStatus}
                    onClick={() => {
                      imgClickHandler();
                    }}
                  />
                  <Button
                    onClickCallBk={handleDownload}
                    svg={<DownloadIcon />}
                    tooltip={`Download ${label}`}
                    ariaLabel={`Download ${label}`}
                    postionClass="fit-content"
                  />
                </div>
              ) : (
                <div>
                  <a href={selectedFile.url} download>
                    Download Scan
                  </a>
                </div>
              )}
            </>
          ) : (
            <div>No {labelkey === 'scans' ? 'Scan' : 'Photo'} available</div>
          )}
        </>
      )}
    </div>
  );
}

export default SingleImageUploader;
