// import * as actionTypes from '../../actionTypes';
// import { ApiRelativePaths, _agent } from '../../../utils/globalURLs';
// import axiosInstance from '../../../network/interceptor/interceptor';
// // import { CommonUtils } from 'utils/commonfunctions/commonfunctions';

// const createParentUser = (userInfo) => {
//     console.log(userInfo);
//     return {
//         type: actionTypes.SET_USER,
//         userInfo: userInfo,
//     };
// };

// export const createParentUserAction = (url_path, data) => {
//     return (dispatch) => {
//         const path = ApiRelativePaths[url_path];

//         axiosInstance
//             .post(path, data)
//             .then((res) => {
//                 console.log(res);
//                 const finalRes = {
//                     result: 'success',
//                     data: { ...res.data },
//                 };
//                 dispatch(setUserInfo(finalRes));
//             })
//             .catch((err) => {
//                 const finalErr = {
//                     result: 'error',
//                     data: err.response?.data,
//                 };
//                 dispatch(setUserInfo(finalErr));
//             });
//     };
// };
