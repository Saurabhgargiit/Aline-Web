import * as actionTypes from '../../actionTypes';

const getAllPatientsInitialState = {
    allPatients: {},
};

const getAllPatientReducer = (state = getAllPatientsInitialState, action) => {
    switch (action.type) {
        case actionTypes.SET_ALL_PATIENTS: {
            return {
                ...state,
                allPatients: action.allPatients,
            };
        }
        default: {
            return state;
        }
    }
};

export default getAllPatientReducer;
