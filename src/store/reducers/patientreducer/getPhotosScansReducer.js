import * as actionTypes from '../../actionTypes';

const getPhotosScansInitialState = {
    photosScans: {},
};

const getPhotosScansReducer = (state = getPhotosScansInitialState, action) => {
    switch (action.type) {
        case actionTypes.SET_PHOTOS_SCANS: {
            return {
                ...state,
                photosScans: action.photosScans,
            };
        }
        default: {
            return state;
        }
    }
};

export default getPhotosScansReducer;
