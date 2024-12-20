import * as actionTypes from '../../actionTypes';
import { ApiRelativePaths, _agent } from '../../../utils/globalURLs';
import axiosInstance from '../../../network/interceptor/interceptor';
import { CommonUtils } from '../../../utils/commonfunctions/commonfunctions';

const setAllPatientsInfo = (allPatients) => {
  return {
    type: actionTypes.SET_ALL_PATIENTS,
    allPatients: allPatients,
  };
};

export const getAllPatientsAction = (
  url_path,
  dynamicVal = [],
  query = {},
  payloadBody
) => {
  return (dispatch) => {
    const path = ApiRelativePaths[url_path];
    const generatedURL = CommonUtils.generateGetApiPath(
      path,
      dynamicVal,
      query
    );

    axiosInstance
      .post(generatedURL, payloadBody)
      .then((res) => {
        const finalRes = {
          result: 'success',
          data: { ...res.data },
        };
        dispatch(setAllPatientsInfo(finalRes));
      })
      .catch((err) => {
        const finalErr = {
          result: 'error',
          data: err.response?.data,
        };
        dispatch(setAllPatientsInfo(finalErr));
      });
  };
};
