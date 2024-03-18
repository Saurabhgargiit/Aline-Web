import axios from 'axios';
import { CommonConstants } from '../../utils/globalConstants';
import { CommonUtils } from '../../utils/commonfunctions/commonfunctions';

const { ACCESS_TOKEN, REFRESH_TOKEN } = CommonConstants;
const axiosInstance = axios.create({
    headers: {
        Authorization: localStorage.getItem(ACCESS_TOKEN),
        RefreshToken: localStorage.getItem(REFRESH_TOKEN),
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
axiosInstance.defaults.baseURL = 'http://localhost:3001';

createAxiosResponseInterceptor(axiosInstance);

function createAxiosResponseInterceptor(axiosInstance) {
    if (axiosInstance !== undefined) {
        let responseUrl;
        axiosInstance.interceptors.response.use(
            (response) => {
                console.log(response);
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
                // Reject promise if usual error
            }
        );
    }
}

export default axiosInstance;
