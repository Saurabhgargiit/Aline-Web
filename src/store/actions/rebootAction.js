import * as actionTypes from '../actionTypes';
import { ApiRelativePaths, _agent } from '../../utils/globalURLs';
import axiosInstance from '../../network/interceptor/interceptor';
import { CommonUtils } from '../../utils/commonfunctions/commonfunctions';

const setRebootIDs = (rebootIDs) => {
    return {
        type: actionTypes.SET_REBOOT_DATA,
        rebootIDs: rebootIDs,
    };
};

export const setSelectedRebootAction = (selectedRebootID) => {
    return {
        type: actionTypes.SET_SELECTED_REBOOT,
        selectedRebootID: selectedRebootID,
    };
};



export const rebootAction = (url_path, dynamicVal = [], query = {}) => {
    return (dispatch) => {
        const path = ApiRelativePaths[url_path];
        const generatedURL = CommonUtils.generateGetApiPath(path, dynamicVal, query);

        axiosInstance
            .get(generatedURL)
            .then((res) => {
                const finalRes = {
                    result: 'success',
                    data: [ ...res.data ], //its array here. Special case.
                };
                dispatch(setRebootIDs(finalRes));
            })
            .catch((err) => {
                const finalErr = {
                    result: 'error',
                    data: err.response?.data,
                };
                dispatch(setRebootIDs(finalErr));
            });
    };
};