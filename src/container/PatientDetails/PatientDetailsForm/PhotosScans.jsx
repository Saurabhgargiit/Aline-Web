import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast, Bounce } from 'react-toastify';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

import Button from '../../../components/Button/Button';
import ImgViewer from '../../../components/ImgViewer/ImgViewer';

import { uploadToS3 } from '../../../utils/aws';
import { putCall } from '../../../utils/commonfunctions/apicallactions';
import { sanitizeFileName } from '../../../utils/commonfunctions/commonfunctions';

import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Download from 'yet-another-react-lightbox/plugins/download';

import { ReactComponent as DownloadIcon } from '../../../assets/icons/download.svg';
import { ReactComponent as UploadIcon } from '../../../assets/icons/upload.svg';
import { ReactComponent as CloudUploadIcon } from '../../../assets/icons/cloud-upload.svg';
import { ReactComponent as CrossIcon } from '../../../assets/icons/cross.svg';
import './PhotosScans.scss';

const labels = {
  profilePhoto: 'Profile Photo',
  extFront: 'Face Front',
  extSide: 'Face Side',
  extOblique: 'Face Oblique',
  intFront: 'Teeth Front',
  intSideLeft: 'Teeth Side Left',
  intFrontRight: 'Teeth Front Right',
  intMaxilla: 'Maxilla',
  intMandible: 'Mandible',
  opg: 'OPG',
  cep: 'Cephalogram',
  scans: 'Scans',
};

const initState = (obj, value) => {
  const initialState = {};
  Object.keys(obj).forEach((label) => {
    initialState[label] = value;
  });
  return initialState;
};

function PhotosScans({
  isEdit,
  formData,
  cancelFlag,
  getPhotosScans,
  setIsEdit,
  setIsLoading,
  cancelHandler,
  rebootID,
}) {
  const [formValues, setFormValues] = useState({});
  const [selectedFiles, setSelectedFiles] = useState(
    initState(labels, [{ url: '', key: '' }])
  );
  const [loadingStatus, setLoadingStatus] = useState(initState(labels, false));
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxSlides, setLightboxSlides] = useState([]);

  const { patientID } = useParams();

  const fileTypeRestrictions = {
    scans: '.zip,.7z',
    default: 'image/jpeg,image/png,image/gif,image/jpg',
  };

  //file upload to browser input element
  const handleFileChange = (key, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormValues((prev) => ({
          ...prev,
          [key]: { res: e.target.result, file },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  //upload to S3
  const uploadFile = async (label) => {
    const files = formValues[label];
    if (!files.file) return;

    const sanitizedFileName = sanitizeFileName(files.file.name);

    const photoKey = `${patientID}/reboot${rebootID}/${label}-${Date.now()}-${sanitizedFileName}`;

    try {
      //maintain the variable caps letter
      setLoadingStatus((prev) => ({
        ...prev,
        [label]: true,
      }));
      const { Location, Key } = await uploadToS3(photoKey, files.file);
      setSelectedFiles((prev) => ({
        ...prev,
        [label]: [{ url: Location, key: Key }],
      }));
      setFormValues((prev) => {
        const tempFormValues = { ...prev };
        delete tempFormValues[label];
        return tempFormValues;
      });
    } catch (err) {
      console.error('There was an error uploading your file: ', err.message);
      alert('There was an error uploading your file: ', err.message);
    } finally {
      // Set loading status to false
      setLoadingStatus((prev) => ({
        ...prev,
        [label]: false,
      }));
    }
  };

  const submitHandler = () => {
    //post selectedFiles to backend
    const payload = { ...selectedFiles };
    payload['patientID'] = patientID;

    putCall(payload, 'ADD_URLS_TO_DATABASE', [rebootID]).then((data) => {
      if (data.result === 'success') {
        toast.success(`Photos & Scans modified successully.`, {
          position: 'top-right',
          hideProgressBar: false,
          autoClose: 2000,
          closeOnClick: true,
          theme: 'light',
          transition: Bounce,
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
          transition: Bounce,
        });
      }
      // setLoading(false);
    });
  };

  const clearFile = (key) => {
    const readFiles = formValues[key];
    const uploadedFile = selectedFiles[key];

    // Check if there is anything to clear
    if (!readFiles?.file && !uploadedFile[0]?.url) return;

    // Update formValues if there's a file to remove
    if (readFiles?.file) {
      setFormValues((prev) => {
        const tempFormValues = { ...prev };
        delete tempFormValues[key];
        return tempFormValues;
      });
    }

    if (uploadedFile[0]?.url) {
      setSelectedFiles((prev) => {
        return { ...prev, [key]: [{ url: '', key: '' }] };
      });
    }
  };

  //Effect hook to update state when the formData prop changes
  useEffect(() => {
    if (Object.keys(formData).length !== 0) {
      // setFormValues(formData);
      setSelectedFiles(formData);
    }
  }, [formData, cancelFlag]);

  // Prepare images for the lightbox
  useEffect(() => {
    const slides = Object.entries(selectedFiles)
      .filter(([key, value]) => key !== 'scans' && value[0]?.url)
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

  // Handle image download
  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="patientAddEditTopContainer">
      <div className="patientAddEditContainer">
        {Object.entries(labels).map(([key, label], idx) => {
          const fileInputType =
            key === 'scans'
              ? fileTypeRestrictions['scans']
              : fileTypeRestrictions['default'];
          //below is data of file uploaded to input element of browser
          const uploadedFile = formValues[key];

          //below is url of S3 uploaded file or url received from backend
          const selectedFile = selectedFiles[key];

          //data exists or not
          const dataExists = uploadedFile?.res || selectedFile[0]?.url;

          //file added on browser but not uploaded to S3
          const uploadNotDone = uploadedFile?.res;

          return (
            <div
              className="patient-detials-input-fields photo-scans"
              key={`div-${idx}`}
            >
              <label htmlFor={key}>{label}</label>
              {isEdit ? (
                <>
                  {!dataExists && (
                    <>
                      <input
                        id={`file-input-${key}`}
                        type="file"
                        accept={fileInputType}
                        onChange={(e) => handleFileChange(key, e)}
                      />
                      <label
                        htmlFor={`file-input-${key}`}
                        className="upload-label"
                      >
                        <OverlayTrigger
                          key={`file-input-${key}-tooltip`}
                          placement={'top'}
                          overlay={
                            <Tooltip id={`file-input-${key}-tooltip`}>
                              {`Upload Photo`}
                            </Tooltip>
                          }
                        >
                          <UploadIcon />
                        </OverlayTrigger>
                      </label>
                    </>
                  )}
                  {dataExists && (
                    <>
                      {key !== 'scans' ? (
                        <div>
                          <ImgViewer
                            src={uploadedFile?.res || selectedFile[0]?.url}
                            alt={label}
                            loading={loadingStatus[key]}
                            onClick={() => openLightbox(idx)}
                          />
                          <Button
                            onClickCallBk={() => clearFile(key)}
                            svg={<CrossIcon />}
                            tooltip={`Remove ${label}`}
                            ariaLabel={`Remove ${label}`}
                            postionClass="fit-content"
                          ></Button>
                        </div>
                      ) : (
                        <div>
                          <a
                            href={uploadedFile?.res || selectedFile[0]?.url}
                            download
                          >
                            Download Scan
                          </a>
                          <button onClick={() => clearFile(key)}>Remove</button>
                        </div>
                      )}
                    </>
                  )}
                  {uploadNotDone && (
                    <Button
                      onClickCallBk={() => uploadFile(key)}
                      svg={<CloudUploadIcon />}
                      tooltip={`Upload ${label}`}
                      ariaLabel={`Upload ${label}`}
                      postionClass="fit-content"
                    ></Button>
                  )}
                </>
              ) : (
                <>
                  {key !== 'scans' &&
                    (selectedFile[0]?.url ? (
                      <div>
                        <ImgViewer
                          src={selectedFile[0]?.url}
                          alt={label}
                          loading={loadingStatus[key]}
                          onClick={() => openLightbox(idx)}
                        />
                        <Button
                          onClickCallBk={() =>
                            handleDownload(
                              uploadedFile?.res || selectedFile[0]?.url,
                              `${label}.jpg`
                            )
                          }
                          svg={<DownloadIcon />}
                          tooltip={`Download ${label}`}
                          ariaLabel={`Download ${label}`}
                          postionClass="fit-content"
                        ></Button>
                      </div>
                    ) : (
                      <div>No Photo available</div>
                    ))}
                  {key === 'scans' && (
                    <a href={selectedFile[0]?.url} download>
                      Download Scan
                    </a>
                  )}
                </>
              )}
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
