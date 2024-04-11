import * as actionTypes from '../../actionTypes';
import { ApiRelativePaths, _agent } from '../../../utils/globalURLs';
import axiosInstance from '../../../network/interceptor/interceptor';

const setUserInfo = (userInfo) => {
    return {
        type: actionTypes.SET_USER,
        userInfo: userInfo,
    };
};

export const getsignedInUserInfo = (url_path) => {
    return (dispatch) => {
        const path = ApiRelativePaths[url_path];

        axiosInstance
            .get(path)
            .then((res) => {
                const finalRes = {
                    result: 'success',
                    data: { ...res.data },
                };
                dispatch(setUserInfo(finalRes));
            })
            .catch((err) => {
                const finalErr = {
                    result: 'error',
                    data: err.response?.data,
                };
                dispatch(setUserInfo(finalErr));
            });
    };
};
