import * as actionTypes from '../../actionTypes';

const userInfoInitialState = {
    userInfo: {},
};

const userInfoReducer = (state = userInfoInitialState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER: {
            return {
                ...state,
                userInfo: action.userInfo,
            };
        }
        default: {
            return state;
        }
    }
};

export default userInfoReducer;
