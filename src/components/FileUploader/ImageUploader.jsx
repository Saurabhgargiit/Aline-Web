import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { toast } from 'react-toastify';

import ImgViewer from '../ImgViewer/ImgViewer';
import Button from '../Button/Button';

import { uploadToS3 } from '../../utils/aws';
import { sanitizeFileName, downloadFile } from '../../utils/commonfunctions/commonfunctions';

import { ReactComponent as UploadIcon } from '../../assets/icons/upload.svg';
import { ReactComponent as CloudUploadIcon } from '../../assets/icons/cloud-upload.svg';
import { ReactComponent as CrossIcon } from '../../assets/icons/cross.svg';
import { ReactComponent as DownloadIcon } from '../../assets/icons/download.svg';

import './ImageUploader.scss';

/**
 * A component for uploading single or multiple images
 * 
 * @param {Object} props Component props
 * @param {string} props.label Display label for the uploader
 * @param {string} props.labelkey Key used for the uploaded files in state
 * @param {string} props.fileTypeRestrictions File type restrictions
 * @param {string} props.patientID Patient ID for file path
 * @param {string} props.rebootID Reboot ID for file path
 * @param {string} props.folder Subfolder for file path
 * @param {boolean} props.multiple Whether to allow multiple file uploads
 * @param {Array|Object} props.existingFile(s) Files already uploaded
 * @param {Function} props.onFileUpload Callback when a file is uploaded (single)
 * @param {Function} props.onFilesUpload Callback when files are uploaded (multiple)
 * @param {boolean} props.isEdit Whether in edit mode
 * @param {Function} props.imgClickHandler Callback for image clicks (for lightbox)
 */
function ImageUploader({
  label,
  labelkey,
  fileTypeRestrictions,
  patientID,
  rebootID,
  folder = '',
  multiple = false,
  existingFile,
  existingFiles,
  onFileUpload,
  onFilesUpload,
  isEdit,
  imgClickHandler,
}) {
  // Single file state
  const [formValue, setFormValue] = useState({ res: '', file: null });
  const [selectedFile, setSelectedFile] = useState({ url: '', key: '' });

  // Multiple files state
  const [formValues, setFormValues] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Common state
  const [loadingStatus, setLoadingStatus] = useState(false);

  // Initialize state from props
  useEffect(() => {
    if (multiple) {
      if (existingFiles) {
        // Normalize existingFiles to always have objects with a url property
        const normalizedFiles = existingFiles.map((file) => {
          if (typeof file === 'string') {
            return { url: file, key: '' };
          }
          return file; // Already in correct format { url:..., key:... }
        });
        setSelectedFiles(normalizedFiles);
      }
    } else {
      setSelectedFile(existingFile || { url: '', key: '' });
    }
  }, [multiple, existingFile, existingFiles]);

  // Handle file selection for a single file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormValue({ res: '', file });
    }
  };

  // Handle file selection for multiple files
  const handleFilesChange = (event) => {
    const files = Array.from(event.target.files);
    const newFormValues = files.map((file) => ({ file }));
    setFormValues((prev) => [...prev, ...newFormValues]);
  };

  // Upload a single file to S3
  const uploadFile = async () => {
    const { file } = formValue;
    if (!file) return;

    const sanitizedFileName = sanitizeFileName(file.name);
    const filePath = folder 
      ? `${patientID}/${folder}/${labelkey}-${Date.now()}-${sanitizedFileName}`
      : `${patientID}/reboot${rebootID || '0'}/${labelkey}-${Date.now()}-${sanitizedFileName}`;

    try {
      setLoadingStatus(true);
      const { Location, Key } = await uploadToS3(filePath, file);
      setSelectedFile({ url: Location, key: Key });
      setFormValue({ res: '', file: null });
      if (onFileUpload) {
        onFileUpload({ [labelkey]: [{ url: Location, key: Key }] });
      }
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

  // Upload multiple files to S3
  const uploadFiles = async () => {
    if (formValues.length === 0) return;

    try {
      setLoadingStatus(true);
      const uploadedFiles = [];

      for (const { file } of formValues) {
        const sanitizedFileName = sanitizeFileName(file.name);
        const filePath = folder 
          ? `${patientID}/${folder}/${labelkey}-${Date.now()}-${sanitizedFileName}`
          : `${patientID}/reboot${rebootID || '0'}/${labelkey}-${Date.now()}-${sanitizedFileName}`;
        
        const { Location, Key } = await uploadToS3(filePath, file);
        uploadedFiles.push({ url: Location, key: Key });
      }

      const updatedFiles = [...selectedFiles, ...uploadedFiles];
      setSelectedFiles(updatedFiles);
      setFormValues([]);
      
      if (onFilesUpload) {
        onFilesUpload({ [labelkey]: updatedFiles });
      }
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

  // Clear a selected file - for both single and multiple modes
  const clearFile = (index, isUploaded) => {
    if (multiple) {
      if (isUploaded) {
        const updatedSelectedFiles = selectedFiles.filter((_, idx) => idx !== index);
        setSelectedFiles(updatedSelectedFiles);
        if (onFilesUpload) {
          onFilesUpload({ [labelkey]: updatedSelectedFiles });
        }
      } else {
        const updatedFormValues = formValues.filter((_, idx) => idx !== index);
        setFormValues(updatedFormValues);
      }
    } else {
      if (formValue.file) {
        setFormValue({ res: '', file: null });
      }

      if (selectedFile.url) {
        setSelectedFile({ url: '', key: '' });
        if (onFileUpload) {
          onFileUpload({ [labelkey]: [{ url: '', key: '' }] });
        }
      }
    }
  };

  // Handle file download
  const handleDownload = (url, filename) => {
    if (!url) return;
    
    const isScans = labelkey === 'scans';
    const extension = isScans ? 'zip' : 'jpg';
    const fileName = filename || `${label}.${extension}`;
    
    downloadFile(url, fileName);
  };

  // Helper variables
  const singleDataExists = formValue.file || selectedFile.url;
  const singleUploadNotDone = formValue.file;
  const multipleUploadNotDone = formValues.length > 0;

  return (
    <div className={`image-uploader ${multiple ? 'multiple' : 'single'}`}>
      <label htmlFor={labelkey}>{label}</label>
      
      {/* SINGLE IMAGE MODE */}
      {!multiple && (
        <>
          {isEdit ? (
            <>
              {!singleDataExists && (
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
                      placement="top"
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
              
              {singleDataExists && (
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
                          if (imgClickHandler) imgClickHandler();
                        }}
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="file-info">
                        <span>{formValue.file?.name || 'Scan uploaded'}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              <div className="buttons">
                {singleDataExists && (
                  <Button
                    onClickCallBk={() => clearFile()}
                    svg={<CrossIcon />}
                    tooltip={`Remove ${label}`}
                    ariaLabel={`Remove ${label}`}
                    postionClass="fit-content"
                  />
                )}
                {singleUploadNotDone && (
                  <Button
                    onClickCallBk={uploadFile}
                    svg={<CloudUploadIcon />}
                    tooltip={`Upload ${label}`}
                    ariaLabel={`Upload ${label}`}
                    postionClass="fit-content"
                  />
                )}
              </div>
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
                          if (imgClickHandler) imgClickHandler();
                        }}
                      />
                      <Button
                        onClickCallBk={() => handleDownload(selectedFile.url)}
                        svg={<DownloadIcon />}
                        tooltip={`Download ${label}`}
                        ariaLabel={`Download ${label}`}
                        postionClass="center-position width100"
                      />
                    </div>
                  ) : (
                    <div className="file-info">
                      <span>Scan uploaded</span>
                      <a href={selectedFile.url} download={`${label}.zip`}>
                        Download Scan
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-url">
                  No {labelkey === 'scans' ? 'Scans' : 'Photo'} available
                </div>
              )}
            </>
          )}
        </>
      )}
      
      {/* MULTIPLE IMAGES MODE */}
      {multiple && (
        <>
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
                  placement="top"
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
                          onClick={() => imgClickHandler && imgClickHandler(index)}
                        />
                        <Button
                          onClickCallBk={() => clearFile(index, true)}
                          svg={<CrossIcon />}
                          tooltip={`Remove ${label} ${index + 1}`}
                          ariaLabel={`Remove ${label} ${index + 1}`}
                          postionClass="button-pos"
                        />
                      </>
                    ) : (
                      <>
                        <div className="file-info">
                          <span>{`Scan ${index + 1}`}</span>
                          <Button
                            onClickCallBk={() => handleDownload(file.url, `Scan_${index + 1}.zip`)}
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
                          postionClass="button-pos"
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
                          tooltip={`Remove ${label} ${selectedFiles.length + index + 1}`}
                          ariaLabel={`Remove ${label} ${selectedFiles.length + index + 1}`}
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
              
              {multipleUploadNotDone && (
                <div className="buttons">
                  <Button
                    onClickCallBk={uploadFiles}
                    svg={<CloudUploadIcon />}
                    tooltip="Upload to Cloud"
                    ariaLabel="Upload to Cloud"
                    postionClass="fit-content"
                  />
                </div>
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
                            onClick={() => imgClickHandler && imgClickHandler(index)}
                          />
                          <Button
                            onClickCallBk={() => handleDownload(file.url, `${label}_${index + 1}.jpg`)}
                            svg={<DownloadIcon />}
                            tooltip={`Download ${label} ${index + 1}`}
                            ariaLabel={`Download ${label} ${index + 1}`}
                            postionClass="button-pos"
                          />
                        </>
                      ) : (
                        <>
                          <div className="file-info">
                            <span>{`Scan ${index + 1}`}</span>
                            <a href={file.url} download={`Scan_${index + 1}.zip`}>
                              Download Scan
                            </a>
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
        </>
      )}
    </div>
  );
}

export default ImageUploader; 