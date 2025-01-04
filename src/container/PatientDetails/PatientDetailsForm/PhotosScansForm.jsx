import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import SVG from 'react-inlinesvg';

import PhotosScans from './PhotosScans';
import Button from '../../../components/Button/Button';
import { withReducer } from '../../../hoc/withReducer';
import Loader from '../../common/Loader/Loader';

import getPhotosScansReducer from '../../../store/reducers/patientreducer/getPhotosScansReducer';
import { getPhotosScansAction } from '../../../store/actions/patientaction/getPhotosScansAction';
import { somethingWentWrong } from '../../../utils/globalConstants';

import '../PatientDetailsContainer.scss';

function PhotosScansForm() {
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelFlag, setCancelFlag] = useState(false);
  // const [submitFlag, setSubmitFlag] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const [photosScans, setPhotosScans] = useState({});

  const fetchedPhotosScans = useSelector(
    (state) => state.getPhotosScans.photosScans
  );
  const rebootID = useSelector((state) => state.rebootReducer.selectedRebootID);

  const dispatch = useDispatch();

  const { patientID } = useParams();

  //api function for getting the patient Details
  const getPhotosScans = (patientID) => {
    dispatch(
      getPhotosScansAction('GET_PHOTOS_SCANS_URLS', [patientID, rebootID])
    );
  };

  const editHandler = () => {
    if (!isEdit) {
      setIsEdit(true);
    }
  };

  const cancelHandler = useCallback(() => {
    setIsEdit(false);
    setPhotosScans(convertFormat(fetchedPhotosScans.data, 'patientID') || {}); //set to redux state value
    setCancelFlag((state) => !state);
  }, [fetchedPhotosScans]);

  const convertFormat = (obj, filterVal) => {
    const formattedObj = {};
    Object.keys(obj).forEach((key) => {
      if (key !== filterVal) {
        if (key === 'scanURL') {
          formattedObj[key] = obj[key] || '';
        } else {
          formattedObj[key] = [{ url: obj[key][0], key: '' }];
        }
      }
    });
    return formattedObj;
  };

  //@@@@@@@@@@@@@@useEffect@@@@@@@@@@@@@
  useEffect(() => {
    getPhotosScans(patientID);
  }, [rebootID]);

  useEffect(() => {
    if (
      fetchedPhotosScans.result === 'success' &&
      fetchedPhotosScans.data !== undefined
    ) {
      setPhotosScans(convertFormat(fetchedPhotosScans.data, 'patientID') || {});
      setIsLoading(false);
      setErrMsg('');
      // }
    } else if (fetchedPhotosScans.result === 'error') {
      setErrMsg(fetchedPhotosScans.data ?? somethingWentWrong);
      setIsLoading(false);
    }
  }, [fetchedPhotosScans]);

  return !isLoading ? (
    !errMsg ? (
      <div className="PatientDetailsContainer">
        <div className="">
          <>
            <div
              id="justify-tab-example"
              className="patient-details-tabs-container"
            >
              <PhotosScans
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                formData={photosScans}
                getPhotosScans={getPhotosScans}
                setIsLoading={setIsLoading}
                cancelHandler={cancelHandler}
                cancelFlag={cancelFlag}
                rebootID={rebootID}
              />
            </div>
            <Button
              postionClass={'home-page-button-pos rightPosEdit'}
              className={'home-page-add-button'}
              svg={
                !isEdit ? (
                  <SVG
                    src={require(`../../../assets/icons/edit-2.svg`).default}
                  />
                ) : (
                  <SVG
                    src={require(`../../../assets/icons/close.svg`).default}
                  />
                )
              }
              onClickCallBk={!isEdit ? editHandler : cancelHandler}
              tooltip={!isEdit ? 'Edit' : 'Cancel'}
            />
          </>
        </div>
      </div>
    ) : (
      <div className="positionRelative top56 center-position">
        <p>{errMsg}</p>
      </div>
    )
  ) : (
    <div className="positionRelative top56 center-position">
      <Loader />
    </div>
  );
}

export default withReducer(
  'getPhotosScans',
  getPhotosScansReducer
)(PhotosScansForm);
