import { useDispatch } from 'react-redux';
import * as actionTypes from '../actionTypes';
import { ApiRelativePaths, _agent } from '../../utils/globalURLs';
import axiosInstance from '../../network/interceptor/interceptor';
import { CommonUtils } from '../../utils/commonfunctions/commonfunctions';

const setPlanDetailsMapping = (planDetailsMapping) => {
    return {
        type: actionTypes.SET_PLANDETAILS_MAPPING,
        planDetailsMapping: planDetailsMapping,
    };
};

export const toggleSideNavigator = () => {
    return {
        type: actionTypes.TOGGLE_SIDE_NAVIGATOR,
        isSideNavigatorVisible: false,
    };
};

export const sidenNavigatorAction = (url_path, dynamicVal = [], query = {}) => {
    return (dispatch) => {
        const path = ApiRelativePaths[url_path];
        const generatedURL = CommonUtils.generateGetApiPath(path, dynamicVal, query);

        axiosInstance
            .get(generatedURL)
            .then((res) => {
                const finalRes = {
                    result: 'success',
                    data: { ...res.data },
                };
                dispatch(setPlanDetailsMapping(finalRes));
            })
            .catch((err) => {
                const finalErr = {
                    result: 'error',
                    data: err.response?.data,
                };
                dispatch(setPlanDetailsMapping(finalErr));
            });
    };
};

export const getPlanDetailsMapping = (dispatch, patientID, rebootID) => {
    dispatch(sidenNavigatorAction('GET_TREATMENTPLAN_MAPPING', [patientID, rebootID]));
};
