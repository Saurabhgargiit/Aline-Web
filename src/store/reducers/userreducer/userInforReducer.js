import * as actionTypes from '../../actionTypes';

const userInfoInitialState = {
    userInfo: {},
    // userName: '',
    // userEmail: '',
    // role: [],
    // mobile: '',
    // userID: {},
};

const userInfoReducer = (state = userInfoInitialState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER: {
            return {
                ...state,
                userInfo: action.userInfo,
                // userName: action.userData.data?.name,
                // userEmail: action.userData.data?.email,
                // role: action.userData.data?.role,
                // mobile: action.userData.data?.mobileNo,
                // userID: action.userData.data?.id,
            };
        }
        default: {
            return state;
        }
    }
};

export default userInfoReducer;
