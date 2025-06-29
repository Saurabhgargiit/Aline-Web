import React from 'react';
import UnifiedFileUploader from './UnifiedFileUploader';

/**
 * FileUploader Component - Legacy wrapper for backward compatibility
 * 
 * This component serves as a compatibility layer for existing code that uses
 * the old FileUploader component. It maps the props to the new UnifiedFileUploader.
 *
 * @param {Object} props Component props
 * @param {string} props.label Display label for the uploader
 * @param {string} props.labelkey Key used for the uploaded files in state
 * @param {string} props.fileTypeRestrictions File type restrictions
 * @param {string} props.patientID Patient ID for file path
 * @param {string} props.rebootID Reboot ID for file path
 * @param {string} props.folder Subfolder for file path
 * @param {boolean} props.multiple Whether to allow multiple file uploads
 * @param {Array|Object} props.existingFile File already uploaded (single mode)
 * @param {Array} props.existingFiles Files already uploaded (multiple mode)
 * @param {string|Array|Object} props.uploadedFileFromProps Legacy prop for existing files
 * @param {Function} props.onFileUpload Callback when a file is uploaded (single)
 * @param {Function} props.onFilesUpload Callback when files are uploaded (multiple)
 * @param {Function} props.onUploadComplete Legacy callback for upload completion
 * @param {boolean} props.isEdit Whether in edit mode
 * @param {string} props.fileType Type of file ('pdf', 'video', etc.)
 */
function FileUploader(props) {
  const { uploadedFileFromProps, onUploadComplete, ...restProps } = props;
  
  // Determine fileType based on existing fileTypeRestrictions
  const getFileType = () => {
    const { fileTypeRestrictions, labelkey } = props;
    
    if (labelkey === 'scans') return 'scans';
    
    if (fileTypeRestrictions) {
      if (fileTypeRestrictions.includes('pdf')) return 'pdf';
      if (fileTypeRestrictions.includes('video')) return 'video';
      if (fileTypeRestrictions.includes('image')) return 'image';
    }
    
    return props.fileType || 'default';
  };
  
  // Map legacy props to new props
  const mappedProps = {
    ...restProps,
    fileType: getFileType(),
    // Map uploadedFileFromProps to existingFile if provided
    existingFile: uploadedFileFromProps || restProps.existingFile,
    // Map onUploadComplete to onFileUpload if provided and onFileUpload is not already set
    onFileUpload: restProps.onFileUpload || onUploadComplete,
  };
  
  return (
    <UnifiedFileUploader {...mappedProps} />
  );
}

export default FileUploader;
