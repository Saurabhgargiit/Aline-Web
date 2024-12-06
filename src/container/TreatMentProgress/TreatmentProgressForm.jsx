import React, { useState, useEffect, memo } from 'react';
import { toast, Bounce } from 'react-toastify';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import SVG from 'react-inlinesvg';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Download from 'yet-another-react-lightbox/plugins/download';

import Dropdown from '../../components/Dropdown/Dropdown';
import Loader from '../common/Loader/Loader';
import Button from '../../components/Button/Button';
import TextArea from '../../components/TextArea/TextArea';
import MultipleImagesUploader from '../../components/FileUploader/MultipleImagesUploader';

import { CommonUtils } from '../../utils/commonfunctions/commonfunctions';
import { visitTypes, alignerTracking } from './TreatmentProgressConstants';
import {
  getCall,
  postCall,
  putCall,
} from '../../utils/commonfunctions/apicallactions';

import './TreatmentProgressForm.scss';

const TreatmentProgressForm = () => {
  const { patientID, visitMode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const visitID = searchParams?.get('id');

  // Determine the mode based on visitMode
  let mode;
  if (visitMode === 'add') {
    mode = 'add';
  } else if (visitMode?.includes('edit')) {
    mode = 'edit';
  } else if (visitMode === 'view') {
    mode = 'view';
  } else {
    mode = 'view';
    console.warn('Unexpected visitMode. Defaulting to "view" mode.');
  }

  const isAdd = mode === 'add';
  const isEdit = mode === 'edit';
  const isView = mode === 'view';

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [existingData, setExistingData] = useState({});

  const initialFormValues = {
    createdOn: existingData?.createdOn
      ? CommonUtils.formatDate(existingData.createdOn)
      : CommonUtils.formatDate(new Date()),
    progress: existingData?.progress || '',
    visitType: existingData?.visitType || 'firstVisit',
    alignerTracking: existingData?.alignerTracking || 'good',
    notes: existingData?.notes || '',
    photos: existingData?.photos || [],
  };

  const [formValues, setFormValues] = useState(initialFormValues);

  // State for Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxSlides, setLightboxSlides] = useState([]);

  const getVisitDetails = async () => {
    if (!visitID && (isEdit || isView)) {
      setFetchError('No visit ID provided for edit/view mode.');
      setFetchingData(false);
      return;
    }

    try {
      const res = await getCall('GET_PROGRESS_DETAIL', [
        patientID,
        visitID || '6751f5562d4dfa31bc530d6c', // Placeholder for a real visitID
      ]);

      if (res.result === 'success' && res.data) {
        setExistingData(res.data);
        setFetchError('');
      } else {
        setFetchError(res.error || 'Failed to fetch visit details.');
      }
    } catch (error) {
      console.error('Error fetching visit details:', error);
      setFetchError('An error occurred while fetching the visit details.');
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    if ((isEdit || isView) && visitID) {
      if (!existingData.id || existingData.id !== visitID) {
        getVisitDetails();
      } else {
        // We already have data for this visit, no need to fetch again
        setFetchingData(false);
      }
    } else {
      // add mode or no visitID
      setFetchingData(false);
    }
  }, [visitID, patientID, isEdit, isView]);

  const normalizedFiles = (photos) =>
    photos.map((file) => {
      if (typeof file === 'string') {
        return { url: file, key: '' };
      }
      return file; // Already in correct format { url:..., key:... }
    });

  useEffect(() => {
    if (existingData && (isEdit || isView)) {
      // If photos are strings from GET call, just keep them as is (no normalization)
      setFormValues({
        createdOn: existingData.createdOn
          ? CommonUtils.formatDate(existingData.createdOn)
          : CommonUtils.formatDate(new Date()),
        progress: existingData.progress || '',
        visitType: existingData.visitType || 'firstVisit',
        alignerTracking: existingData.alignerTracking || 'good',
        notes: existingData.notes || '',
        photos:
          existingData.photos?.length > 0
            ? normalizedFiles(existingData.photos)
            : [],
      });
    }
  }, [existingData, isEdit, isView]);

  const validateForm = () => {
    const newErrors = {};

    if (!formValues.createdOn) {
      newErrors.createdOn = 'Date of Visit is required.';
    }

    if (!formValues.progress.trim()) {
      newErrors.progress = 'Visit Name is required.';
    }

    if (!formValues.visitType) {
      newErrors.visitType = 'Visit Type is required.';
    }

    if (!formValues.alignerTracking) {
      newErrors.alignerTracking = 'Aligner Tracking is required.';
    }

    if ((isEdit || isAdd) && !formValues.notes.trim()) {
      newErrors.notes = 'Notes for Visit are required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveHandler = () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form.', {
        position: 'top-right',
        hideProgressBar: false,
        autoClose: 3000,
        closeOnClick: true,
        theme: 'light',
        transition: Bounce,
      });
      return;
    }

    const payload = {
      ...formValues,
      patientID,
      id: isEdit ? visitID : null,
      treatmentPlanID: null,
    };

    setIsLoading(true);

    const callFn = isEdit ? putCall : postCall;
    const successMsg = isEdit
      ? 'Treatment Progress Modified.'
      : 'Treatment Progress Added.';
    const url = isEdit ? 'UPDATE_VISIT' : 'CREATE_VISIT';

    callFn(payload, url, [patientID])
      .then((data) => {
        setIsLoading(false);
        if (data.result === 'success') {
          toast.success(successMsg, {
            position: 'top-right',
            hideProgressBar: false,
            autoClose: 2000,
            closeOnClick: true,
            theme: 'light',
            transition: Bounce,
          });

          if (isEdit) {
            // On edit save: navigate to view mode of the same id
            navigate(
              `/patientDetails/${patientID}/progress/view?id=${visitID}`
            );
            getVisitDetails();
          } else {
            // On add save: navigate back to table page
            navigate(`/patientDetails/${patientID}/progress`);
          }
        } else {
          toast.error(data.error || 'An error occurred.', {
            position: 'top-right',
            hideProgressBar: false,
            autoClose: 3000,
            closeOnClick: true,
            theme: 'light',
            transition: Bounce,
          });
        }
      })
      .catch((error) => {
        toast.error('An error occurred while saving the treatment progress.', {
          position: 'top-right',
          hideProgressBar: false,
          autoClose: 3000,
          closeOnClick: true,
          theme: 'light',
          transition: Bounce,
        });
        setIsLoading(false);
      });
  };

  const cancelHandler = () => {
    if (isEdit && visitID) {
      navigate(`/patientDetails/${patientID}/progress/view?id=${visitID}`);
    } else if (isAdd) {
      navigate(`/patientDetails/${patientID}/progress`);
    } else {
      navigate(`/patientDetails/${patientID}/progress`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleDropdownChange = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleFilesUpload = (fileObj) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      photos: fileObj.photos,
    }));
  };
  console.log(formValues);

  useEffect(() => {
    if (Array.isArray(formValues.photos) && formValues.photos.length) {
      const slides = formValues.photos.map(({ key, url }, i) => ({
        src: url,
        title: 'Photo ' + i,
      }));
      setLightboxSlides(slides);
    }
  }, [formValues.photos]);

  // Lightbox logic
  const openLightbox = (index) => {
    if (isView) {
      setLightboxIndex(index);
      setLightboxOpen(true);
    }
  };

  const closeLightbox = (e) => {
    // Close lightbox on overlay click
    setLightboxOpen(false);
    setLightboxIndex(0);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (fetchingData) {
    return <Loader />;
  }

  if (fetchError) {
    return (
      <div className="error-message">
        <p>{fetchError}</p>
        <Button title="Go Back" onClickCallBk={() => navigate(-1)} />
      </div>
    );
  }

  return (
    <>
      <div className="patientAddEditTopContainer mb-4">
        <div className="patient-details-tabs-container">
          <div className="patientAddEditContainer">
            <div className="patient-details-input-fields gap-8 marginEdit">
              <span className="mb-2 sub-heading">Visit Details</span>

              <div className="label-input-container mb-2">
                <label htmlFor="createdOn">
                  Date of Visit<span className="required">*</span>
                </label>
                <input
                  id="createdOn"
                  name="createdOn"
                  type="date"
                  value={formValues.createdOn}
                  onChange={handleInputChange}
                  disabled={isView}
                  className={errors.createdOn ? 'input-error' : ''}
                />
                {errors.createdOn && (
                  <span className="error-text">{errors.createdOn}</span>
                )}
              </div>

              <div className="mb-2 arches-container">
                <div className="step-container">
                  <label htmlFor="progress">
                    Visit Name<span className="required">*</span>
                  </label>
                  <input
                    id="progress"
                    name="progress"
                    type="text"
                    value={formValues.progress}
                    onChange={handleInputChange}
                    disabled={isView}
                    className={errors.progress ? 'input-error' : ''}
                  />
                  {errors.progress && (
                    <span className="error-text">{errors.progress}</span>
                  )}
                </div>
              </div>

              <div className="mb-2 arches-container">
                <div className="step-container">
                  <label htmlFor="visitType">
                    Visit Type<span className="required">*</span>
                  </label>
                  <Dropdown
                    id="visitType"
                    options={visitTypes}
                    selectedValue={formValues.visitType}
                    onChangeCallBk={(value) =>
                      handleDropdownChange('visitType', value)
                    }
                    disabled={isView}
                  />
                  {errors.visitType && (
                    <span className="error-text">{errors.visitType}</span>
                  )}
                </div>
              </div>

              <div className="arches-container">
                <div className="step-container">
                  <label htmlFor="alignerTracking">
                    Aligner Tracking<span className="required">*</span>
                  </label>
                  <Dropdown
                    id="alignerTracking"
                    options={alignerTracking}
                    selectedValue={formValues.alignerTracking}
                    onChangeCallBk={(value) =>
                      handleDropdownChange('alignerTracking', value)
                    }
                    disabled={isView}
                  />
                  {errors.alignerTracking && (
                    <span className="error-text">{errors.alignerTracking}</span>
                  )}
                </div>
              </div>
            </div>

            <TextArea
              posClassName={`patient-details-input-fields gap-8 sub-heading marginEdit`}
              key={'notes'}
              label={'Visit Notes*:'}
              id={'notes'}
              name="notes"
              placeholder={
                isEdit || isAdd
                  ? 'Enter progress notes here...'
                  : 'No notes available'
              }
              value={formValues.notes}
              onChangeCallBack={handleInputChange}
              disabled={isView}
              error={errors.notes}
            />

            <div
              className={`patient-details-input-fields gap-8 pdf-container photo-scans ${
                isEdit || isAdd ? 'marginEdit' : 'marginView'
              }`}
            >
              <MultipleImagesUploader
                label="Photos"
                labelkey="photos"
                fileTypeRestrictions="image/jpeg,image/png,image/gif,image/jpg"
                patientID={patientID}
                existingFiles={formValues.photos || []}
                onFilesUpload={handleFilesUpload}
                isEdit={isEdit || isAdd}
                imgClickHandler={openLightbox}
                folder={'progress'}
              />
            </div>

            <div className="arches-container button-group">
              {(isAdd || isEdit) && (
                <Button title="Cancel" onClickCallBk={cancelHandler} />
              )}
              {(isAdd || isEdit) && (
                <Button
                  title="Save"
                  type="primary"
                  onClickCallBk={saveHandler}
                />
              )}
            </div>
          </div>
          {isView && visitID && (
            <Button
              postionClass={'home-page-button-pos rightPosEdit'}
              className={'home-page-add-button'}
              svg={
                <SVG src={require(`../../assets/icons/edit-2.svg`).default} />
              }
              onClickCallBk={() =>
                navigate(
                  `/patientDetails/${patientID}/progress/edit?id=${visitID}`
                )
              }
              tooltip={'Edit Details'}
            />
          )}
        </div>
        {lightboxOpen && (
          <Lightbox
            open={lightboxOpen}
            close={closeLightbox}
            slides={lightboxSlides}
            index={lightboxIndex}
            plugins={[Zoom, Download]}
          />
        )}
      </div>
    </>
  );
};

export default memo(TreatmentProgressForm);
