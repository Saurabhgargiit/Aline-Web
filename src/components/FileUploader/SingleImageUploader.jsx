import React from 'react';
import ImageUploader from './ImageUploader';

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
  return (
    <ImageUploader
      label={label}
      labelkey={labelkey}
      fileTypeRestrictions={fileTypeRestrictions}
      patientID={patientID}
      rebootID={rebootID}
      multiple={false}
      existingFile={existingFile}
      onFileUpload={onFileUpload}
      isEdit={isEdit}
      imgClickHandler={imgClickHandler}
    />
  );
}

export default SingleImageUploader;
