import React from 'react';
import UnifiedFileUploader from './UnifiedFileUploader';

/**
 * MultipleImagesUploader Component - Legacy wrapper for backward compatibility
 * 
 * This component serves as a compatibility layer for existing code that uses
 * the old MultipleImagesUploader component. It maps props to UnifiedFileUploader
 * with multiple=true.
 *
 * @param {Object} props - All props are passed through to UnifiedFileUploader
 */
function MultipleImagesUploader(props) {
  return (
    <UnifiedFileUploader
      {...props}
      fileType="image"
      multiple={true}
    />
  );
}

export default MultipleImagesUploader;
