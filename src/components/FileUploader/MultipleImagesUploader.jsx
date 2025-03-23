import React from 'react';
import ImageUploader from './ImageUploader';

function MultipleImagesUploader({
  label,
  labelkey,
  fileTypeRestrictions,
  patientID,
  folder,
  existingFiles,
  onFilesUpload,
  isEdit,
  imgClickHandler,
}) {
  return (
    <ImageUploader
      label={label}
      labelkey={labelkey}
      fileTypeRestrictions={fileTypeRestrictions}
      patientID={patientID}
      folder={folder}
      multiple={true}
      existingFiles={existingFiles}
      onFilesUpload={onFilesUpload}
      isEdit={isEdit}
      imgClickHandler={imgClickHandler}
    />
  );
}

export default MultipleImagesUploader;
