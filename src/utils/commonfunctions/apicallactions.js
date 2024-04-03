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

    // if (url_path === 'LOGOUT') {
    //     generatedURL = host + '/' + path;
    // } else {
    //     generatedURL = CommonUtils.URLGenerator(params, path, paramObj);
    // }

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
                console.log(error);
                result = {
                    result: 'error',
                    error: error.response?.data?.message,
                };
            }
        )
        .catch((err) => {
            console.log(err);
            result = {
                result: 'catch_error',
                error: err?.response?.data?.error,
            };
        });

    return result;
};

// export const putCall = async (data: any, url_path: string, optionalData?: any) => {
//     let params = {};
//     let path = ApiPaths[url_path];
//     // let host = process.env.REACT_APP_ANALYTICS_HOST;
//     let paramObj = {};
//     let generatedURL = CommonUtils.URLGenerator(params, path, paramObj);
//     let result = {};

//     let urlData;
//     if (optionalData !== '') {
//         urlData = generatedURL + optionalData;
//     } else {
//         urlData = generatedURL;
//     }

//     await axiosInstance
//         .put(urlData, data)
//         .then(
//             (res) => {
//                 result = {
//                     result: 'success',
//                     data: res.data,
//                 };
//             },
//             (error) => {
//                 result = {
//                     result: 'error',
//                     error: error.response.data.error,
//                 };
//             }
//         )
//         .catch((err) => {
//             result = {
//                 result: 'cacth_error',
//                 error: err.response.data.error,
//             };
//         });

//     return result;
// };
