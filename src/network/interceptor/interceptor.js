import axios from 'axios';
import { CommonConstants } from '../../utils/globalConstants';
import { CommonUtils } from '../../utils/commonfunctions/commonfunctions';
import { ApiRelativePaths } from '../../utils/globalURLs';

const { ACCESS_TOKEN, REFRESH_TOKEN } = CommonConstants;
const axiosInstance = axios.create({
    headers: {
        Authorization: localStorage.getItem(ACCESS_TOKEN),
        // RefreshToken: localStorage.getItem(REFRESH_TOKEN),
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        config.headers['Authorization'] = localStorage.getItem(ACCESS_TOKEN);
        // Do something before request is sent.
        if (
            !localStorage.getItem(ACCESS_TOKEN) ||
            !localStorage.getItem(REFRESH_TOKEN) ||
            !CommonUtils.checkRefreshTokenValidity()
        ) {
            CommonUtils.logout();
        } else {
            // console.log(config);
            return config;
        }
    },
    (error) => Promise.reject(error)
);
if (process.env.REACT_APP_ENV === 'development') {
    axiosInstance.defaults.baseURL = 'http://localhost:3001';
}

createAxiosResponseInterceptor(axiosInstance);

function createAxiosResponseInterceptor(axiosInstance) {
    if (axiosInstance !== undefined) {
        let responseUrl;
        axiosInstance.interceptors.response.use(
            (response) => {
                var url = window.location.href;
                responseUrl = response.config.url;
                if (
                    url.includes('?isMaintenance=true') &&
                    !responseUrl.includes('organization/signature')
                ) {
                    url = url.split('?isMaintenance=true')[0];
                    window.location.href = url;
                } else if (
                    url.includes('&isMaintenance=true') &&
                    !responseUrl.includes('organization/signature')
                ) {
                    url = url.split('&isMaintenance=true')[0];
                    window.location.href = url;
                }
                return response;
            },
            (error) => {
                console.log(error);
                // Reject promise if usual error
                if (error !== undefined && error.response !== undefined) {
                    if (
                        error.response.status === 401 &&
                        error.config &&
                        !error.config.__isRetryRequest
                    ) {
                        return getAuthToken()
                            .then((response) => {
                                if (response) {
                                    CommonUtils.saveTokens(response);
                                    const originalRequest = error.config;
                                    originalRequest.__isRetryRequest = true;
                                    error.config.headers['Authorization'] =
                                        localStorage.getItem(REFRESH_TOKEN);
                                    return axiosInstance(error.config);
                                } else {
                                    Promise.reject(error);
                                }
                            })
                            .catch((error) => {
                                // getModal('error');
                                return Promise.reject(error);
                            });
                        // .finally(createAxiosResponseInterceptor);
                        // const originalRequest = error.config;
                        // originalRequest._retry = true;
                        // const tokens = await refreshAccessToken();
                        // axios.defaults.headers.common['Authorization'] =
                        //             'Bearer ' + access_token;
                        //         return axiosInstance(originalRequest);
                    }
                    return Promise.reject(error);
                }
            }
        );
    }
}

export default axiosInstance;

let authTokenRequest = null;
// This function makes a call to get the auth token
// or it returns the same promise as an in-progress call to get the auth token
function getAuthToken() {
    if (!authTokenRequest) {
        authTokenRequest = axios
            .post(ApiRelativePaths['GET_TOKENS'], {
                headers: {
                    Authorization: localStorage.getItem(ACCESS_TOKEN),
                },
            })
            .catch(function (error) {
                // localStorage.clear();
                // setTimeout(() => {
                //     window.open(process.env.REACT_APP_HOST, "_self");
                // }, 0)
            });

        authTokenRequest.then(resetAuthTokenRequest, resetAuthTokenRequest);
    }
    return authTokenRequest;
}

function resetAuthTokenRequest() {
    authTokenRequest = null;
}
