import * as actionTypes from '../actionTypes';
import { ApiRelativePaths, _agent } from '../../utils/globalURLs';

export const setSearchDataAction = (searchData) => {
  return {
    type: actionTypes.SET_SEARCH_DATA,
    searchData: searchData,
  };
};

// export const searchAction = (url_path, dynamicVal = [], query = {}) => {
//   return (dispatch) => {
//     const path = ApiRelativePaths[url_path];
//     const generatedURL = CommonUtils.generateGetApiPath(
//       path,
//       dynamicVal,
//       query
//     );

//     axiosInstance
//       .get(generatedURL)
//       .then((res) => {
//         const finalRes = {
//           result: 'success',
//           data: [...res.data], //its array here. Special case.
//         };
//         dispatch(setRebootIDs(finalRes));
//       })
//       .catch((err) => {
//         const finalErr = {
//           result: 'error',
//           data: err.response?.data,
//         };
//         dispatch(setRebootIDs(finalErr));
//       });
//   };
// };
