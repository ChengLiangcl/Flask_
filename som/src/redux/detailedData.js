import * as ActionTypes from './ActionTypes';

export const DetailedData = (state = {
    isLoading: true,
    errMess: null,
    detailedData: []
}, action) => {

    switch (action.type) {
        case ActionTypes.ADD_DETAILEDDATA:
            return { ...state, isLoading: false, errMess: null, detailedData: action.payload };

        case ActionTypes.DETAILEDDATA_LOADING:
            return { ...state, isLoading: true, errMess: null, detailedData: [] }

        case ActionTypes.DETAILEDDATA_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        default:
            return state;
    }
};