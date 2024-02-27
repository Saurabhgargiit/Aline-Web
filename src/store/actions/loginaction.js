import * as actionTypes from '../actionTypes';
import { ApiRelativePaths, _agent } from '../../utils/globalURLs';
import axios from 'axios';

const userUpdate = (userData) => {
    return {
        type: actionTypes.UPDATE_USER,
        data: userData,
    };
};

export const loginAction = (loginInfo) => {
    return {
        type: actionTypes.LOGIN,
        data: loginInfo,
    };
};

const login = (loginData) => {
    // return sendHttpsRequest(loginData);
};

export const getLoginData = (url_path, data) => {
    return (dispatch) => {
        const path = ApiRelativePaths[url_path];
        // const generatedURL = _agent + path;
        axios.defaults.baseURL = 'http://localhost:3001';
        axios
            .post(path, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => {
                data = {
                    result: 'success',
                    data: res.data,
                };
            })
            .catch((err) => {
                data = {
                    result: 'error',
                    data: err.response?.data,
                };
            })
            .then(() => {
                dispatch(loginAction(true));
            });
    };
};
