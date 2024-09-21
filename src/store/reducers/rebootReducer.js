import * as actionTypes from '../actionTypes';

const rebootDetailsInitialState = {
    rebootIDs: [],
    selectedRebootID: 0
};

const rebootReducer = (state = rebootDetailsInitialState, action) => {
    switch (action.type) {
        case actionTypes.SET_REBOOT_DATA: {
            return {
                ...state,
                rebootIDs: action.rebootIDs,
            };
        }
        case actionTypes.SET_SELECTED_REBOOT:
            return {
                ...state,
                selectedRebootID: action.selectedRebootID,
            };
        default: {
            return state;
        }
    }
};

export default rebootReducer;
