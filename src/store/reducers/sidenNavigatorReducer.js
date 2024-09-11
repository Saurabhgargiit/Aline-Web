import * as actionTypes from '../actionTypes';

const planDetailsMappingInitialState = {
    planDetailsMapping: {},
    // rebootID{

    // }
};

const sidenNavigatorReducer = (state = planDetailsMappingInitialState, action) => {
    switch (action.type) {
        case actionTypes.SET_PLANDETAILS_MAPPING: {
            return {
                ...state,
                planDetailsMapping: action.planDetailsMapping,
            };
        }
        default: {
            return state;
        }
    }
};

export default sidenNavigatorReducer;
