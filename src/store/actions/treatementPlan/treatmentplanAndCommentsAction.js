import * as actionTypes from '../../actionTypes';
import { ApiRelativePaths, _agent } from '../../../utils/globalURLs';
import axiosInstance from '../../../network/interceptor/interceptor';
import { CommonUtils } from '../../../utils/commonfunctions/commonfunctions';

const setPlanDetails = (planDetails) => {
    return {
        type: actionTypes.SET_PLAN_DETAILS,
        planDetails: planDetails,
    };
};

const setCommentsDetails = (commentDetails) => {
    return {
        type: actionTypes.SET_PLAN_COMMENTS,
        commentDetails: commentDetails,
    };
};

export const getPlanDetailsAndCommentsAction = (actionType, url_path, dynamicVal = [], query = {}) => {
    return (dispatch) => {
        const path = ApiRelativePaths[url_path];
        const generatedURL = CommonUtils.generateGetApiPath(path, dynamicVal, query);

        axiosInstance
            .get(generatedURL)
            .then((res) => {
                const finalRes = {
                    result: 'success',
                    data: { ...res.data },
                };
                switch(actionType){
                    case actionTypes.SET_PLAN_DETAILS:{
                        dispatch(setPlanDetails(finalRes));
                        break;
                    }
                    case actionTypes.SET_PLAN_COMMENTS:{
                        dispatch(setCommentsDetails(finalRes));
                        break;
                    }
                    default:
                        break;
                }
            })
            .catch((err) => {
                const finalErr = {
                    result: 'error',
                    data: err.response?.data,
                };
                switch(actionType){
                    case actionTypes.SET_PLAN_DETAILS:{
                        dispatch(setPlanDetails(finalErr));
                        break;
                    }
                    case actionTypes.SET_PLAN_COMMENTS:{
                        dispatch(setCommentsDetails(finalErr));
                        break;
                    }
                    default:
                        break;
                }
            });
    };
};

