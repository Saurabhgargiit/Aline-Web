import axiosInstance from '../../network/interceptor/interceptor';
import { ApiRelativePaths } from '../globalURLs';
import { CommonUtils } from './commonfunctions';
import axios from 'axios';

let ApiPaths = ApiRelativePaths;

export const postCall = async (data, url_path, dynamicSeg = [], params = {}, optionalData) => {
    let path = ApiPaths[url_path];
    // let host = process.env.REACT_APP_ANALYTICS_HOST;
    let generatedURL;
    let result = {};

    // if (optionalData !== '' && optionalData !== undefined) {
    //     generatedURL = generatedURL + optionalData;
    // }
    generatedURL = CommonUtils.generateGetApiPath(path, dynamicSeg, params);

    await axiosInstance
        .post(generatedURL, data)
        .then(
            (res) => {
                result = {
                    result: 'success',
                    data: res.data.data,
                };
            },
            (error) => {
                result = {
                    result: 'error',
                    error: error.response?.data?.message,
                };
            }
        )
        .catch((err) => {
            result = {
                result: 'catch_error',
                error: err?.response?.data?.message,
            };
        });

    return result;
};

export const putCall = async (data, url_path, dynamicSeg = [], params = {}, optionalData) => {
    let path = ApiPaths[url_path];
    // let host = process.env.REACT_APP_ANALYTICS_HOST;
    let generatedURL;
    let result = {};

    // if (optionalData !== '' && optionalData !== undefined) {
    //     generatedURL = generatedURL + optionalData;
    // }
    generatedURL = CommonUtils.generateGetApiPath(path, dynamicSeg, params);

    // let urlData;
    // if (optionalData !== '') {
    //     urlData = generatedURL + optionalData;
    // } else {
    //     urlData = generatedURL;
    // }

    await axiosInstance
        .put(generatedURL, data)
        .then(
            (res) => {
                result = {
                    result: 'success',
                    data: res.data,
                };
            },
            (error) => {
                result = {
                    result: 'error',
                    error: error.response?.data?.message,
                };
            }
        )
        .catch((error) => {
            result = {
                result: 'cacth_error',
                error: error.response?.data?.message,
            };
        });

    return result;
};
