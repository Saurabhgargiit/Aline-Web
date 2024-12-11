import * as actionTypes from '../actionTypes';
import {
  CommonUtils,
  ScreenUtils,
} from '../../utils/commonfunctions/commonfunctions';

const planDetailsMappingInitialState = {
  planDetailsMapping: {},
  isSideNavigatorVisible: ScreenUtils.isLaptopScreen(),
  // rebootID{

  // }
};

const sidenNavigatorReducer = (
  state = planDetailsMappingInitialState,
  action
) => {
  switch (action.type) {
    case actionTypes.SET_PLANDETAILS_MAPPING: {
      return {
        ...state,
        planDetailsMapping: action.planDetailsMapping,
      };
    }
    case actionTypes.TOGGLE_SIDE_NAVIGATOR:
      return {
        ...state,
        isSideNavigatorVisible: !state.isSideNavigatorVisible,
      };
    default: {
      return state;
    }
  }
};

export default sidenNavigatorReducer;
