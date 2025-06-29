import React from 'react';
import UnifiedFileUploader from './UnifiedFileUploader';

/**
 * ScansUploader Component - For uploading scan files in multiple formats
 * 
 * This component is a specialized wrapper around UnifiedFileUploader
 * that's configured for uploading medical scans in multiple formats
 * (PDF, images, ZIP archives, DICOM, etc.)
 *
 * @param {Object} props - All props are passed through to UnifiedFileUploader
 */
function ScansUploader(props) {
  return (
    <UnifiedFileUploader
      {...props}
      fileType="scans"
      multiple={props.multiple !== false} // Default to true for multiple files
    />
  );
}

export default ScansUploader; 