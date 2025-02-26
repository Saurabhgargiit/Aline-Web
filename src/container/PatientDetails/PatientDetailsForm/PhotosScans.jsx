import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Button from '../../../components/Button/Button';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Download from 'yet-another-react-lightbox/plugins/download';
import { putCall } from '../../../utils/commonfunctions/apicallactions';

import SingleImageUploader from '../../../components/FileUploader/SingleImageUploader';

import './PhotosScans.scss';

const labels = {
  scans: 'Scans',
  scanURL: 'Scan URL',
  profilePhoto: 'Profile Photo',
  extFront: 'Face Front',
  extSide: 'Face Side',
  extOblique: 'Face Oblique',
  intFront: 'I/O Front',
  intSideLeft: 'I/O Left Side',
  intFrontRight: 'I/O Right Side',
  intMaxilla: 'Maxilla',
  intMandible: 'Mandible',
  opg: 'OPG',
  cep: 'Cephalogram',
};

const ensureAbsoluteUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `http://${url}`;
};

function PhotosScans({
  isEdit,
  formData,
  getPhotosScans,
  setIsEdit,
  setIsLoading,
  cancelHandler,
  rebootID,
}) {
  const [selectedFiles, setSelectedFiles] = useState({});
  const [scanURL, setScanURL] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxSlides, setLightboxSlides] = useState([]);

  const { patientID } = useParams();

  const fileTypeRestrictions = {
    scans: '.zip,.7z,application/zip,application/x-7z-compressed',
    default: 'image/jpeg,image/png,image/gif,image/jpg',
  };

  // Update selectedFiles when a file is uploaded
  const handleFileUpload = (fileObj) => {
    setSelectedFiles((prev) => ({
      ...prev,
      ...fileObj,
    }));
  };

  const initState = (obj, value, filterFiles) => {
    const initialState = {};
    Object.keys(obj).forEach((label) => {
      if (!filterFiles.hasOwnProperty(label)) {
        initialState[label] = value;
      }
    });
    return { ...filterFiles, ...initialState };
  };

  // Effect hook to update scanURL when formData changes
  useEffect(() => {
    if (formData.scanURL) {
      setScanURL(formData.scanURL);
    }
  }, [formData]);

  const handleScanURLChange = (e) => {
    setScanURL(e.target.value.trim());
  };

  const submitHandler = () => {
    let payload = { ...selectedFiles };
    payload = initState(labels, [{ url: '', key: '' }], selectedFiles);

    // Add scanURL to payload as string, ensuring it's absolute
    payload.scanURL = scanURL ? ensureAbsoluteUrl(scanURL) : '';
    payload['patientID'] = patientID;

    putCall(payload, 'ADD_URLS_TO_DATABASE', [rebootID]).then((data) => {
      if (data.result === 'success') {
        toast.success(`Photos & Scans modified successfully.`, {
          position: 'top-right',
          hideProgressBar: false,
          autoClose: 2000,
          closeOnClick: true,
          theme: 'light',
        });
        setIsLoading(true);
        getPhotosScans(patientID);
        setIsEdit(false);
      } else if (data.result === 'error') {
        toast.error(data.error ?? 'data.error', {
          position: 'top-right',
          hideProgressBar: false,
          autoClose: 2000,
          closeOnClick: true,
          theme: 'light',
        });
      }
    });
  };

  // Effect hook to update state when the formData prop changes
  useEffect(() => {
    // if (Object.keys(formData).length !== 0) {
    setSelectedFiles(formData);
    // }
  }, [formData]);

  // Prepare images for the lightbox
  useEffect(() => {
    const slides = Object.entries(selectedFiles)
      .filter(
        ([key, value]) =>
          key !== 'scans' && value[0]?.url && labels.hasOwnProperty(key)
      )
      .map(([key, value]) => ({
        src: value[0].url,
        title: labels[key],
      }));
    setLightboxSlides(slides);
  }, [selectedFiles]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="patientAddEditTopContainer">
      <div className="patientAddEditContainer">
        {Object.entries(labels).map(([key, label], idx) => {
          // Special handling for scanURL
          if (key === 'scanURL') {
            const absoluteUrl = ensureAbsoluteUrl(scanURL);
            return (
              <div
                className="patient-details-input-fields photo-scans"
                key={`div-${idx}`}
              >
                <label>{label}</label>
                {isEdit ? (
                  <input
                    type="text"
                    value={scanURL}
                    onChange={handleScanURLChange}
                    className="form-control"
                    placeholder="Enter scan URL"
                  />
                ) : (
                  <div className="scan-url-display">
                    {scanURL ? (
                      <a
                        href={absoluteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="scan-url-link"
                      >
                        {scanURL}
                      </a>
                    ) : (
                      <span className="no-url">No Scan URL provided</span>
                    )}
                  </div>
                )}
              </div>
            );
          }

          const fileInputType =
            key === 'scans'
              ? fileTypeRestrictions['scans']
              : fileTypeRestrictions['default'];

          // Determine the index for the lightbox (excluding scans and scanURL)
          const lightboxImageIndex = Object.keys(labels)
            .filter((k) => k !== 'scans' && k !== 'scanURL')
            .indexOf(key);

          return (
            <div
              className="patient-details-input-fields photo-scans"
              key={`div-${idx}`}
            >
              <SingleImageUploader
                label={label}
                labelkey={key}
                fileTypeRestrictions={fileInputType}
                patientID={patientID}
                rebootID={rebootID}
                existingFile={selectedFiles[key]?.[0]}
                onFileUpload={handleFileUpload}
                isEdit={isEdit}
                imgClickHandler={() => openLightbox(lightboxImageIndex)}
              />
            </div>
          );
        })}
        <div className="buttons pt-4">
          <Button
            postionClass="mx-5"
            className={!isEdit ? 'noVisible' : ''}
            title="Cancel"
            onClickCallBk={cancelHandler}
          />
          <Button
            postionClass="mx-5"
            className={!isEdit ? 'noVisible' : ''}
            title="Save"
            type="primary"
            onClickCallBk={submitHandler}
          />
        </div>
      </div>
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={lightboxSlides}
          index={lightboxIndex}
          plugins={[Zoom, Download]}
        />
      )}
    </div>
  );
}

export default PhotosScans;
