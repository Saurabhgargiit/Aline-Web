import * as actionTypes from '../actionTypes';

const loginIntialState = {
    loggedIn: false,
    loggedInData: {},
};

const loginReducer = (state = loginIntialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN:
            return {
                ...state,
                loggedIn: action.loggedInData?.isLoggedIn,
                loggedInData: action.loggedInData,
            };

        default:
            return state;
    }
};

export default loginReducer;

// const createReducer
