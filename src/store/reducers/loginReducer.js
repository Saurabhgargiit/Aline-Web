import * as actionTypes from "../actionTypes";

const loginIntialState = {
  loggedIn: false,
}

const loginReducer = (state = loginIntialState, action) => {

  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        loggedIn: action.userData.loggedIn,
      };
      break;

    default:
      return state;
      break;
  }


}

export default loginReducer;

// const createReducer
