import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { toast } from 'react-toastify';

import ImgViewer from '../ImgViewer/ImgViewer';
import PDFViewer from '../PDFViewer/PDFViewer';
import Button from '../Button/Button';

import { uploadToS3 } from '../../utils/aws';
import { sanitizeFileName, downloadFile } from '../../utils/commonfunctions/commonfunctions';

import { ReactComponent as UploadIcon } from '../../assets/icons/upload.svg';
import { ReactComponent as CloudUploadIcon } from '../../assets/icons/cloud-upload.svg';
import { ReactComponent as CrossIcon } from '../../assets/icons/cross.svg';
import { ReactComponent as DownloadIcon } from '../../assets/icons/download.svg';

import './UnifiedFileUploader.scss';

// Common file type restrictions
const fileTypeRestrictions = {
  pdf: 'application/pdf',
  video: 'video/mp4,video/x-m4v,video/*',
  image: 'image/jpeg,image/png,image/gif,image/jpg',
  zip: 'application/zip,application/x-zip-compressed,multipart/x-zip,application/7z,.zip,.7z',
  scans: '.zip,.7z,application/zip,application/x-7z-compressed,application/pdf,image/jpeg,image/png,image/dicom',
  default: '*/*'
};

/**
 * A unified component for uploading files (images, PDFs, videos, scans, etc.)
 * 
 * @param {Object} props Component props
 * @param {string} props.label Display label for the uploader
 * @param {string} props.labelkey Key used for the uploaded files in state
 * @param {string} props.fileType Type of file ('image', 'pdf', 'video', 'scans', etc.)
 * @param {string} props.fileTypeRestrictions Custom file type restrictions
 * @param {string} props.patientID Patient ID for file path
 * @param {string} props.rebootID Reboot ID for file path
 * @param {string} props.folder Subfolder for file path
 * @param {boolean} props.multiple Whether to allow multiple file uploads
 * @param {Array|Object} props.existingFile File already uploaded (single mode)
 * @param {Array} props.existingFiles Files already uploaded (multiple mode)
 * @param {Function} props.onFileUpload Callback when a file is uploaded (single)
 * @param {Function} props.onFilesUpload Callback when files are uploaded (multiple)
 * @param {boolean} props.isEdit Whether in edit mode
 * @param {Function} props.imgClickHandler Callback for image clicks (for lightbox)
 * @param {string} props.styleClassName Additional CSS classes
 */
function UnifiedFileUploader({
  label,
  labelkey,
  fileType = 'image',
  fileTypeRestrictions: customFileTypeRestrictions,
  patientID,
  rebootID,
  folder = '',
  multiple = false,
  existingFile,
  existingFiles,
  onFileUpload,
  onFilesUpload,
  isEdit = false,
  imgClickHandler,
  styleClassName = ''
}) {
  // Single file state
  const [formValue, setFormValue] = useState({ res: '', file: null });
  const [selectedFile, setSelectedFile] = useState({ url: '', key: '' });

  // Multiple files state
  const [formValues, setFormValues] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Common state
  const [loadingStatus, setLoadingStatus] = useState(false);

  // Get appropriate file type restrictions
  const getRestrictions = () => {
    if (customFileTypeRestrictions) return customFileTypeRestrictions;
    return fileTypeRestrictions[fileType] || fileTypeRestrictions.default;
  };

  // Validate file type against restrictions
  const validateFileType = (file) => {
    const restrictions = getRestrictions();
    
    // If restrictions are '*/*' or default, allow all files
    if (restrictions === '*/*' || restrictions === fileTypeRestrictions.default) {
      return { isValid: true, error: null };
    }
    // Get file extension and MIME type
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();
    const fileMimeType = file.type.toLowerCase();

    // Parse restrictions to get allowed extensions and MIME types
    const restrictionArray = restrictions.split(',').map(r => r.trim().toLowerCase());
    
    // Check if file is allowed
    const isAllowed = restrictionArray.some(restriction => {
      // Check by extension (starts with .)
      if (restriction.startsWith('.')) {
        return fileName.endsWith(restriction);
      }
      // Check by MIME type
      if (restriction.includes('/')) {
        // Handle wildcards like video/*
        if (restriction.endsWith('/*')) {
          const mimeCategory = restriction.split('/')[0];
          return fileMimeType.startsWith(mimeCategory + '/');
        }
        // Exact MIME type match
        return fileMimeType === restriction;
      }
      return false;
    });

    if (!isAllowed) {
      const fileTypeDisplay = fileType === 'image' ? 'images' : 
                             fileType === 'pdf' ? 'PDF files' :
                             fileType === 'video' ? 'video files' :
                             fileType === 'scans' ? 'scans (PDF, images, or ZIP)' :
                             'allowed file types';
      
      return {
        isValid: false,
        error: `Invalid file type. Only ${fileTypeDisplay} are allowed. You selected: ${file.name} (${file.type || 'unknown type'})`
      };
    }

    return { isValid: true, error: null };
  };

  // Initialize state from props
  useEffect(() => {
    if (multiple) {
      if (existingFiles) {
        // Make sure existingFiles is always an array
        const filesArray = Array.isArray(existingFiles) ? existingFiles : [];
        
        // Normalize existingFiles to always have objects with a url property
        const normalizedFiles = filesArray.map((file) => {
          if (typeof file === 'string') {
            return { url: file, key: '' };
          }
          if (file && typeof file === 'object') {
            return { url: file.url || '', key: file.key || '' };
          }
          return { url: '', key: '' }; // Default empty file object
        });
        setSelectedFiles(normalizedFiles);
      } else {
        setSelectedFiles([]);
      }
    } else {
      // Check if existingFile is string, existingFiles, or uploadedFileFromProps
      if (existingFile) {
        if (typeof existingFile === 'string') {
          setSelectedFile({ url: existingFile, key: '' });
        } else if (Array.isArray(existingFile) && existingFile.length > 0) {
          const file = existingFile[0];
          setSelectedFile(typeof file === 'string' ? { url: file, key: '' } : 
            (file && typeof file === 'object' ? { url: file.url || '', key: file.key || '' } : { url: '', key: '' }));
        } else if (existingFile.url) {
          setSelectedFile({ url: existingFile.url, key: existingFile.key || '' });
        } else {
          setSelectedFile({ url: '', key: '' });
        }
      } else {
        setSelectedFile({ url: '', key: '' });
      }
    }
  }, [multiple, existingFile, existingFiles]);

  // Handle file selection for a single file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validation = validateFileType(file);
      if (!validation.isValid) {
        toast.error(validation.error, {
          position: 'top-right',
          hideProgressBar: false,
          autoClose: 4000,
          closeOnClick: true,
          theme: 'light',
        });
        // Clear the input
        event.target.value = '';
        event.target.files = null;
        return;
      }

      if (fileType === 'image' || fileType === 'pdf' || fileType === 'video') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormValue({ res: e.target.result, file });
        };
        reader.readAsDataURL(file);
      } else {
        setFormValue({ res: '', file });
      }
    }
  };

  // Handle file selection for multiple files
  const handleFilesChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = [];
    const invalidFiles = [];

    // Validate each file
    files.forEach(file => {
      const validation = validateFileType(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        invalidFiles.push({ file, error: validation.error });
      }
    });

    // Show error for invalid files
    if (invalidFiles.length > 0) {
      const errorMessage = invalidFiles.length === 1 
        ? invalidFiles[0].error
        : `${invalidFiles.length} files were rejected. Only valid file types are allowed.`;
      
      toast.error(errorMessage, {
        position: 'top-right',
        hideProgressBar: false,
        autoClose: 4000,
        closeOnClick: true,
        theme: 'light',
      });
    }

    // Add valid files to form values
    if (validFiles.length > 0) {
      const newFormValues = validFiles.map((file) => ({ file }));
      setFormValues((prev) => [...prev, ...newFormValues]);
    }

    // Clear the input
    event.target.value = '';
    event.target.files = null;
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
      
      // Support both legacy and new callback patterns
      if (onFileUpload) {
        onFileUpload({ [labelkey]: [{ url: Location, key: Key }] });
      }
    } catch (err) {
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
      
      // Call the helper function to handle the callback
      handleFilesUpload(updatedFiles);
    } catch (err) {
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

  // Helper function to normalize files and call onFilesUpload
  const handleFilesUpload = (files) => {
    if (onFilesUpload && Array.isArray(files)) {
      // Ensure all files have the expected structure
      const normalizedFiles = files.map(file => {
        if (typeof file === 'string') {
          return { url: file, key: '' };
        }
        if (file && typeof file === 'object') {
          return { url: file.url || '', key: file.key || '' };
        }
        return { url: '', key: '' };
      });
      
      onFilesUpload({ [labelkey]: normalizedFiles });
    }
  };

  // Clear a selected file - for both single and multiple modes
  const clearFile = (index, isUploaded) => {
    if (multiple) {
      if (isUploaded) {
        // Ensure selectedFiles is an array before filtering
        if (Array.isArray(selectedFiles)) {
          const updatedSelectedFiles = selectedFiles.filter((_, idx) => idx !== index);
          setSelectedFiles(updatedSelectedFiles);
          // Use the helper function to handle the callback
          handleFilesUpload(updatedSelectedFiles);
        }
      } else {
        // Ensure formValues is an array before filtering
        if (Array.isArray(formValues)) {
          const updatedFormValues = formValues.filter((_, idx) => idx !== index);
          setFormValues(updatedFormValues);
        }
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
    
    // Extract extension from the URL
    let extension = '';
    try {
      // First try to get extension from the provided filename
      if (filename && filename.includes('.')) {
        const parts = filename.split('.');
        extension = parts[parts.length - 1];
      } else {
        // Extract from URL
        const urlParts = url.split('?')[0].split('/'); // Remove query params and split by /
        const fileNameFromUrl = urlParts[urlParts.length - 1]; // Get the last part (filename)
        
        if (fileNameFromUrl && fileNameFromUrl.includes('.')) {
          const parts = fileNameFromUrl.split('.');
          extension = parts[parts.length - 1];
        }
      }
    } catch (error) {
      console.warn('Could not extract file extension from URL:', url);
    }
    
    // Fallback to default extension if none found
    if (!extension) {
      switch (fileType) {
        case 'pdf': extension = 'pdf'; break;
        case 'video': extension = 'mp4'; break;
        case 'image': extension = 'jpg'; break;
        case 'zip':
        case 'scans': extension = 'zip'; break;
        default: extension = 'file'; break;
      }
    }
    
    const fileName = filename || `${label}_${Date.now()}.${extension}`;
    downloadFile(url, fileName);
  };

  // Get the appropriate file extension for display
  const getFileExtension = (filename) => {
    if (!filename) return '';
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  };

  // Determine file type from URL or filename
  const getFileTypeFromUrl = (url) => {
    if (!url) return 'unknown';
    
    const extension = url.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return 'image';
    } else if (['pdf'].includes(extension)) {
      return 'pdf';
    } else if (['mp4', 'webm', 'mov', 'avi'].includes(extension)) {
      return 'video';
    } else if (['zip', '7z'].includes(extension)) {
      return 'archive';
    } else {
      return 'unknown';
    }
  };

  // Render file preview based on type
  const renderFilePreview = (fileUrl, filename, isLocal = false) => {
    if (!fileUrl) return null;
    
    // When isLocal is true, fileUrl is already a blob URL (URL.createObjectURL result)
    // When isLocal is false, fileUrl is a regular URL
    const url = fileUrl;
    const detectedType = isLocal ? fileType : getFileTypeFromUrl(url);
    
    switch (detectedType) {
      case 'image':
        return (
          <ImgViewer
            src={url}
            alt={label}
            loading={loadingStatus}
            onClick={() => imgClickHandler && imgClickHandler()}
          />
        );
      case 'pdf':
        return (
          <div className="preview-container file-viewer">
            {loadingStatus && <div className="file-viewer__loading">Uploading...</div>}
            <div className="file-viewer__content">
              <PDFViewer pdfFile={url} styleClassName="" />
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="preview-container file-viewer">
            {loadingStatus && <div className="file-viewer__loading">Uploading...</div>}
            <video className="file-viewer__content" controls src={url} />
          </div>
        );
      default:
        return (
          <div className="file-info">
            <span>{filename || 'File uploaded'}</span>
          </div>
        );
    }
  };

  // Helper variables
  const singleDataExists = formValue.file || selectedFile.url;
  const singleUploadNotDone = formValue.file;
  const multipleUploadNotDone = formValues.length > 0;
  const isScansType = fileType === 'scans';

  // Helper for displaying file type in UI
  const getFileTypeDisplay = (file) => {
    if (!file) return '';
    
    if (file.name) {
      const ext = getFileExtension(file.name);
      switch (ext) {
        case 'pdf': return 'PDF';
        case 'jpg':
        case 'jpeg':
        case 'png': return 'Image';
        case 'zip':
        case '7z': return 'Archive';
        default: return ext.toUpperCase();
      }
    } else if (file.url) {
      return getFileTypeFromUrl(file.url).charAt(0).toUpperCase() + getFileTypeFromUrl(file.url).slice(1);
    }
    
    return '';
  };

  // Helper for displaying scan names
  const getScanDisplayName = (index) => {
    return `scan-${index + 1}`;
  };

  return (
    <div className={`unified-uploader ${multiple ? 'multiple' : 'single'} file-type-${fileType} ${styleClassName}`}>
      <label htmlFor={labelkey}>{label}</label>
      
      {/* SINGLE FILE MODE */}
      {!multiple && (
        <>
          {isEdit ? (
            <>
              {!singleDataExists && (
                <>
                  <input
                    id={`file-input-${labelkey}`}
                    type="file"
                    accept={getRestrictions()}
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
                          {`Upload ${isScansType ? 'Scan' : fileType.charAt(0).toUpperCase() + fileType.slice(1)}`}
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
                  {renderFilePreview(
                    formValue.file ? formValue.res : selectedFile.url,
                    formValue.file?.name,
                    !!formValue.file
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
                  {fileType !== 'scans' ? (
                    <>
                      {renderFilePreview(selectedFile.url)}
                      <div className="buttons">
                        <Button
                          onClickCallBk={() => handleDownload(selectedFile.url)}
                          svg={<DownloadIcon />}
                          tooltip={`Download ${label}`}
                          ariaLabel={`Download ${label}`}
                          postionClass="center-position width100"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="file-info">
                      <span>Scan uploaded</span>
                      <Button
                        onClickCallBk={() => handleDownload(selectedFile.url, `${label}`)}
                        svg={<DownloadIcon />}
                        tooltip={`Download ${label}`}
                        ariaLabel={`Download ${label}`}
                        postionClass="fit-content"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="no-url">
                  No {isScansType ? 'Scans' : fileType === 'image' ? 'Photo' : 'File'} available
                </div>
              )}
            </>
          )}
        </>
      )}
      
      {/* MULTIPLE FILES MODE */}
      {multiple && (
        <>
          {isEdit ? (
            <>
              <input
                id={`file-input-${labelkey}`}
                type="file"
                accept={getRestrictions()}
                multiple
                onChange={handleFilesChange}
              />
              <label htmlFor={`file-input-${labelkey}`} className="upload-label">
                <OverlayTrigger
                  key={`file-input-${labelkey}-tooltip`}
                  placement="top"
                  overlay={
                    <Tooltip id={`file-input-${labelkey}-tooltip`}>
                      {`Add ${isScansType ? 'Scans' : fileType === 'image' ? 'Photos' : 'Files'}`}
                    </Tooltip>
                  }
                >
                  <UploadIcon />
                </OverlayTrigger>
              </label>
              
              <div className="files-preview">
                {selectedFiles.map((file, index) => (
                  <div key={`selected-${index}`} className="file-container">
                    {isScansType ? (
                      <>
                        <div className="file-info">
                          <span>
                            {isScansType ? getScanDisplayName(index) : `${getFileTypeDisplay(file)} ${index + 1}`}
                          </span>
                          <Button
                            onClickCallBk={() => handleDownload(file.url, `${label}_${index + 1}`)}
                            svg={<DownloadIcon />}
                            tooltip={`Download ${isScansType ? getScanDisplayName(index) : `${getFileTypeDisplay(file)} ${index + 1}`}`}
                            ariaLabel={`Download ${isScansType ? getScanDisplayName(index) : `${getFileTypeDisplay(file)} ${index + 1}`}`}
                            postionClass="fit-content"
                          />
                        </div>
                        <Button
                          onClickCallBk={() => clearFile(index, true)}
                          svg={<CrossIcon />}
                          tooltip={`Remove ${isScansType ? getScanDisplayName(index) : `${getFileTypeDisplay(file)} ${index + 1}`}`}
                          ariaLabel={`Remove ${isScansType ? getScanDisplayName(index) : `${getFileTypeDisplay(file)} ${index + 1}`}`}
                          postionClass="button-pos"
                        />
                      </>
                    ) : (
                      <>
                        {renderFilePreview(file.url, null, false)}
                        <Button
                          onClickCallBk={() => handleDownload(file.url, `${label}_${index + 1}`)}
                          svg={<DownloadIcon />}
                          tooltip={`Download ${getFileTypeDisplay(file)}-${index + 1}`}
                          ariaLabel={`Download ${getFileTypeDisplay(file)}-${index + 1}`}
                          postionClass="button-pos"
                        />
                      </>
                    )}
                  </div>
                ))}
                
                {formValues.map((fileObj, index) => (
                  <div key={`form-${index}`} className="file-container">
                    {isScansType ? (
                      <>
                        <div className="file-info">
                          <span>
                            {`${getFileTypeDisplay(fileObj.file)} - ${fileObj.file.name}`}
                          </span>
                        </div>
                        <Button
                          onClickCallBk={() => clearFile(index, false)}
                          svg={<CrossIcon />}
                          tooltip={`Remove ${fileObj.file.name}`}
                          ariaLabel={`Remove ${fileObj.file.name}`}
                          postionClass="button-pos"
                        />
                      </>
                    ) : (
                      <>
                        {renderFilePreview(URL.createObjectURL(fileObj.file), fileObj.file.name, true)}
                        <Button
                          onClickCallBk={() => clearFile(index, false)}
                          svg={<CrossIcon />}
                          tooltip={`Remove ${label} ${selectedFiles.length + index + 1}`}
                          ariaLabel={`Remove ${label} ${selectedFiles.length + index + 1}`}
                          postionClass="button-pos"
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
                      {isScansType ? (
                        <>
                          <div className="file-info">
                            <span>
                              {isScansType ? getScanDisplayName(index) : `${getFileTypeDisplay(file)} ${index + 1}`}
                            </span>
                            <Button
                              onClickCallBk={() => handleDownload(file.url, `${label}_${index + 1}`)}
                              svg={<DownloadIcon />}
                              tooltip={`Download ${isScansType ? getScanDisplayName(index) : `${getFileTypeDisplay(file)} ${index + 1}`}`}
                              ariaLabel={`Download ${isScansType ? getScanDisplayName(index) : `${getFileTypeDisplay(file)} ${index + 1}`}`}
                              postionClass="fit-content"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          {renderFilePreview(file.url, null, false)}
                          <Button
                            onClickCallBk={() => handleDownload(file.url, `${label}_${index + 1}`)}
                            svg={<DownloadIcon />}
                            tooltip={`Download ${getFileTypeDisplay(file)}-${index + 1}`}
                            ariaLabel={`Download ${getFileTypeDisplay(file)}-${index + 1}`}
                            postionClass="button-pos"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-url">
                  No {isScansType ? 'Scans' : fileType === 'image' ? 'Photos' : 'Files'} available
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default UnifiedFileUploader;