import * as actionTypes from '../../actionTypes';
import { ApiRelativePaths, _agent } from '../../../utils/globalURLs';
import axiosInstance from '../../../network/interceptor/interceptor';
// import { CommonUtils } from 'utils/commonfunctions/commonfunctions';

const setUserInfo = (userInfo) => {
    console.log(userInfo);
    return {
        type: actionTypes.SET_USER,
        userInfo: userInfo,
    };
};

export const getsignedInUserInfo = (url_path) => {
    return (dispatch) => {
        const path = '/api/v1/aline/user/getSignedInUserInfo';

        // const generatedURL = _agent + path;
        axiosInstance.defaults.baseURL = 'http://localhost:3001';
        axiosInstance
            .get(path)
            .then((res) => {
                console.log(res);
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
