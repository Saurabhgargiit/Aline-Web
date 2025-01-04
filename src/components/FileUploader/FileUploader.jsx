import React, { useState, useEffect } from 'react';
import { uploadToS3 } from '../../utils/aws';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { toast } from 'react-toastify';

import PDFViewer from '../PDFViewer/PDFViewer';
import Button from '../Button/Button';

import { ReactComponent as UploadIcon } from '../../assets/icons/upload.svg';
import {
  downloadFile,
  sanitizeFileName,
} from '../../utils/commonfunctions/commonfunctions';

import './FileUploader.scss';

const fileTypeRestrictions = {
  pdf: 'application/pdf',
  video: 'video/mp4,video/x-m4v,video/*',
  image: 'image/jpeg,image/png,image/gif,image/jpg',
  zip: 'application/zip,application/x-zip-compressed,multipart/x-zip,application/7z,.zip,.7z',
};

const FileUploader = ({
  label,
  fileType,
  onUploadComplete,
  patientID,
  rebootID,
  uploadedFileFromProps, // for viewing an existing file in Edit mode
  isEdit = false,
  styleClassName = '',
}) => {
  const [fileData, setFileData] = useState({ res: '', file: null });
  const [uploadedFile, setUploadedFile] = useState({ url: '', key: '' });
  const [loadingStatus, setLoadingStatus] = useState(false);

  // *** NEW or UPDATED: On mount or prop change, show the fromProps file (if any)
  useEffect(() => {
    if (uploadedFileFromProps) {
      setUploadedFile((prev) => ({
        ...prev,
        url: uploadedFileFromProps,
        key: prev.key || '',
      }));
    }
  }, [uploadedFileFromProps]);

  // Merge any custom classes
  const className = `fileUploader ${styleClassName}`;

  // *** Handle new file selection
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

  // *** Upload to S3
  const uploadFile = async () => {
    if (!fileData.file) return;
    setLoadingStatus(true);
    const sanitizedFileName = sanitizeFileName(fileData.file.name);
    const fileKey = `${patientID}/reboot${rebootID}/${label}-${Date.now()}-${sanitizedFileName}`;

    try {
      const { Location, key } = await uploadToS3(fileKey, fileData.file);
      setUploadedFile({ url: Location, key });
      setFileData({ res: '', file: null });

      if (onUploadComplete) {
        onUploadComplete({ url: Location, key });
      }
    } catch (err) {
      console.error('Upload error:', err.message);
      toast.error(`Error uploading file: ${err.message}`, {
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

  // *** Remove the current file
  const clearFile = () => {
    setFileData({ res: '', file: null });
    setUploadedFile({ url: '', key: '' });
    if (isEdit) {
      onUploadComplete();
    }
  };

  // *** Renders either video, PDF, etc.
  const renderPreview = () => {
    // finalURL will be either the newly selected file data (`res`) or
    // the previously uploaded/prop file (`uploadedFile.url`).
    const finalURL = fileData.res || uploadedFile.url;

    if (!finalURL) return null; // no file to preview

    if (fileType === 'video') {
      return (
        <div
          className={`preview-container file-viewer ${
            loadingStatus ? 'loading' : ''
          }`}
        >
          {loadingStatus && (
            <div className="file-viewer__loading">Uploading...</div>
          )}
          <video className="file-viewer__content" controls src={finalURL} />
        </div>
      );
    }

    if (fileType === 'pdf') {
      return (
        <div
          className={`preview-container file-viewer ${
            loadingStatus ? 'loading' : ''
          }`}
        >
          {loadingStatus && (
            <div className="file-viewer__loading">Uploading...</div>
          )}
          <div className="file-viewer__content">
            <PDFViewer pdfFile={finalURL} styleClassName="" />
          </div>
        </div>
      );
    }

    // Uncomment if you need images
    // if (fileType === 'image') {
    //   return (
    //     <div className={`preview-container file-viewer ${loadingStatus ? 'loading' : ''}`}>
    //       {loadingStatus && <div className="file-viewer__loading">Uploading...</div>}
    //       <img
    //         className="file-viewer__content"
    //         alt="Uploaded"
    //         src={finalURL}
    //       />
    //     </div>
    //   );
    // }

    // Example for zip or others
    if (fileType === 'zip') {
      return (
        <p>
          {uploadedFile.url
            ? `Uploaded: ${uploadedFile.url}`
            : `Selected: ${fileData.file?.name}`}
        </p>
      );
    }

    return null;
  };

  const handleDownloadFile = () => {
    if (uploadedFile.url) {
      // Dynamically choose an extension based on fileType, or default to .file
      let extension = 'file';
      if (fileType === 'pdf') extension = 'pdf';
      if (fileType === 'video') extension = 'mp4';
      // image, zip, or others as needed

      const fileName = `${label || 'download'}.${extension}`;

      // *** Call the shared utility
      downloadFile(uploadedFile.url, fileName);
    }
  };

  return (
    <div className={className}>
      {/* =========================
          EDIT MODE — Show the file input if there's 
          no "new" or "existing" file loaded 
      ========================= */}
      {!fileData.res && !uploadedFile.url && isEdit && (
        <>
          <input
            id={`file-input-${fileType}`}
            type="file"
            accept={fileTypeRestrictions[fileType] || ''}
            onChange={handleFileChange}
          />
          <label htmlFor={`file-input-${fileType}`} className="upload-label">
            <OverlayTrigger
              key={`file-input-${fileType}-tooltip`}
              placement="top"
              overlay={
                <Tooltip id={`file-input-${fileType}-tooltip`}>
                  {`Upload ${label}`}
                </Tooltip>
              }
            >
              <UploadIcon />
            </OverlayTrigger>
          </label>
        </>
      )}

      {/* =========================
          File Preview (existing or new)
      ========================= */}
      {(fileData.res || uploadedFile.url) && renderPreview()}

      {/* =========================
          Edit Buttons (Remove / Upload) 
          - only shown if isEdit === true and we actually have a file
      ========================= */}
      {isEdit && (fileData.res || uploadedFile.url) && (
        <div className="buttons">
          <Button
            onClickCallBk={clearFile}
            title="Remove File"
            ariaLabel="Remove File"
            postionClass="pt-3"
          />
          {fileData.res && (
            <Button
              onClickCallBk={uploadFile}
              title="Upload File"
              postionClass="pt-3"
              type="primary"
            />
          )}
        </div>
      )}
      {/* VIEW MODE: If there's a file, show a "Download" or "Open" button */}
      {!isEdit && uploadedFile.url && (
        <div className="buttons">
          <Button
            onClickCallBk={handleDownloadFile}
            title="Download File"
            ariaLabel="Download File"
            postionClass="pt-3"
            type="secondary"
          />
        </div>
      )}
    </div>
  );
};

export default FileUploader;
