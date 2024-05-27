import * as actionTypes from '../../actionTypes';

const getPatientDetailsInitialState = {
    patientDetails: {},
};

const getPatientDetailsReducer = (state = getPatientDetailsInitialState, action) => {
    switch (action.type) {
        case actionTypes.SET_PATIENT_DETAILS: {
            return {
                ...state,
                patientDetails: action.patientDetails,
            };
        }
        default: {
            return state;
        }
    }
};

export default getPatientDetailsReducer;
