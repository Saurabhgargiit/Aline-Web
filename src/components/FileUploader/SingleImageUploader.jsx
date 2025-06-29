import React from 'react';
import UnifiedFileUploader from './UnifiedFileUploader';

/**
 * SingleImageUploader Component - Legacy wrapper for backward compatibility
 * 
 * This component serves as a compatibility layer for existing code that uses
 * the old SingleImageUploader component. It maps props to UnifiedFileUploader
 * with multiple=false.
 *
 * @param {Object} props - All props are passed through to UnifiedFileUploader
 */
function SingleImageUploader(props) {
  return (
    <UnifiedFileUploader
      {...props}
      fileType="image"
      multiple={false}
    />
  );
}

export default SingleImageUploader;
