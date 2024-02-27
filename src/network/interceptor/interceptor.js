// import axios from 'axios';
// import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../utils/globalConstants';
// import { clearStorage } from '../../utils/commonfunctions/commonfunctions';
// // localStorage.setItem(ACCESS_TOKEN,token);

// const axiosInstance = axios.create({
//     headers: {
//         AccessToken: localStorage.getItem(ACCESS_TOKEN),
//         RefreshToken: localStorage.getItem(REFRESH_TOKEN),
//         'Content-Type': 'application/json',
//         AppKey: '',
//     },
// });

// axiosInstance.interceptors.request.use(
//     (config) => {
//         //Do something before request is sent.
//         if (!!localStorage.getItem(ACCESS_TOKEN) || !!localStorage.getItem(REFRESH_TOKEN)) {
//             clearStorage();
//         } else {
//             return config;
//         }
//     },
//     (error) => Promise.reject(error)
// );

// createAxiosResponseInterceptor(axiosInstance);

// function createAxiosResponseInterceptor(axiosInstance) {
//     if (!!axiosInstance) {
//     }
// }
