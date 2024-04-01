import * as actionTypes from '../../actionTypes';
import { ApiRelativePaths, _agent } from '../../../utils/globalURLs';
import axiosInstance from '../../../network/interceptor/interceptor';
import { CommonUtils } from '../../../utils/commonfunctions/commonfunctions';

const setAllUserInfo = (allUsers) => {
    return {
        type: actionTypes.SET_ALL_USERS,
        allUsers: allUsers,
    };
};

export const getallusersaction = (url_path, dynamicVal = [], query = {}) => {
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
                dispatch(setAllUserInfo(finalRes));
            })
            .catch((err) => {
                const finalErr = {
                    result: 'error',
                    data: err.response?.data,
                };
                dispatch(setAllUserInfo(finalErr));
            });
    };
};
