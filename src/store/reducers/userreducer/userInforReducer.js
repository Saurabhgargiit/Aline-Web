import * as actionTypes from '../../actionTypes';

const userInfoInitialState = {
    userName: '',
    userEmail: '',
    role: [],
    mobile: '',
    creationDate: {},
};

const userInfoReducer = (state = userInfoInitialState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER: {
            return {
                ...state,
                userName: action.userData.data?.name,
                userEmail: action.userData.data?.email,
                role: action.userData.data?.role,
                mobile: action.userData.data?.mobileNo,
                creationDate: action.userData.data?.creationDate,
            };
        }
        default: {
            return state;
        }
    }
};

export default userInfoReducer;
