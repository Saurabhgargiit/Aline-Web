import * as actionTypes from '../../actionTypes';
import { ApiRelativePaths, _agent } from '../../../utils/globalURLs';
import axiosInstance from '../../../network/interceptor/interceptor';

const setAllUserInfo = (allUsers) => {
    return {
        type: actionTypes.SET_ALL_USERS,
        allUsers: allUsers,
    };
};

export const getallusersaction = (url_path) => {
    return (dispatch) => {
        const path = ApiRelativePaths[url_path];

        axiosInstance
            .get(path)
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
