import * as actionTypes from '../../actionTypes';

const getPlanAndCommentsInitialState = {
    planDetails: {},
    commentDetails:{}
};

const treatmentplanAndCommentsReducer = (state = getPlanAndCommentsInitialState, action) => {
    switch (action.type) {
        case actionTypes.SET_PLAN_DETAILS: {
            return {
                ...state,
                planDetails: action.planDetails,
            };
        }
        case actionTypes.SET_PLAN_COMMENTS: {
            return {
                ...state,
                commentDetails: action.commentDetails,
            };
        }
        default: {
            return state;
        }
    }
};

export default treatmentplanAndCommentsReducer;
