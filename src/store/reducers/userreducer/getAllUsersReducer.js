import * as actionTypes from '../../actionTypes';

const getAllUsersInitialState = {
    allUsers: {},
};

const getAllUsersReducer = (state = getAllUsersInitialState, action) => {
    switch (action.type) {
        case actionTypes.SET_ALL_USERS: {
            return {
                ...state,
                allUsers: action.allUsers,
            };
        }
        default: {
            return state;
        }
    }
};

export default getAllUsersReducer;
