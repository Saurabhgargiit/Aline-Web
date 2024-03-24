import * as actionTypes from '../actionTypes';
import { ApiRelativePaths, _agent } from '../../utils/globalURLs';
import axios from 'axios';
import { CommonUtils } from '../../utils/commonfunctions/commonfunctions';

const userUpdate = (userData) => {
    return {
        type: actionTypes.UPDATE_USER,
        data: userData,
    };
};

//isLoggedIn --> true/false whether user is loggedIn
//fromLogin --> true --> if action is dispatched after proper login using username password
//fromLogin --> false  --> if action is dispatched from app

export const loginAction = (isLoggedIn, fromLogin, loginInfo = {}) => {
    if (isLoggedIn && fromLogin) {
        CommonUtils.saveTokens(loginInfo?.data);
    }
    const loggedInData = {
        isLoggedIn: isLoggedIn,
        loginErr: !isLoggedIn && fromLogin ? loginInfo : '',
    };
    return {
        type: actionTypes.LOGIN,
        loggedInData: loggedInData,
    };
};

export const getLoginData = (url_path, data) => {
    return (dispatch) => {
        const path = ApiRelativePaths[url_path];

        axios.defaults.baseURL = 'http://localhost:3001';
        axios
            .post(path, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => {
                console.log(res);
                const finalRes = {
                    result: 'success',
                    data: { ...res.data },
                };
                dispatch(loginAction(true, true, finalRes));
            })
            .catch((err) => {
                const finalErr = {
                    result: 'error',
                    data: err.response?.data,
                };
                dispatch(loginAction(false, true, finalErr));
            });
    };
};
