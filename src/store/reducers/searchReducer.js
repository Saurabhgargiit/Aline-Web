import * as actionTypes from '../actionTypes';

export const searchInitialState = {
  searchData: {
    searchTerm: '',
    dates: [],
    //add others
  },
};

const searchReducer = (state = searchInitialState, action) => {
  switch (action.type) {
    case actionTypes.SET_SEARCH_DATA: {
      return {
        ...state,
        searchData: action.searchData,
      };
    }
    default: {
      return state;
    }
  }
};

export default searchReducer;
