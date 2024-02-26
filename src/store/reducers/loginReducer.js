import * as actionTypes from '../actionTypes';

const loginIntialState = {
    loggedIn: false,
};

const loginReducer = (state = loginIntialState, action) => {
    console.log(state, action);
    switch (action.type) {
        case actionTypes.LOGIN:
            return {
                ...state,
                loggedIn: action.data,
            };

        default:
            return state;
    }
};

export default loginReducer;

// const createReducer
