import * as ActionTypes from './ActionTypes';

export const AllDatasetFiles = (state = {
    isLoading: false,
    errMess: null,
    isQuery: false,
    datasetFiles: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_ALL_DATASETFILES:
            console.log("Add dataallsetfiles to store");
            return { ...state, isLoading: false, errMess: null, isQuery: false, datasetFiles: action.payload };
        
        case ActionTypes.QUERY_ALL_DATASETFILES:
            return { ...state, isLoading: false, errMess: null, isQuery: true, datasetFiles: action.payload };

        case ActionTypes.ALL_DATASETFILES_LOADING:
            return { ...state, isLoading: true, errMess: null, datasetFiles: [] }

        case ActionTypes.ALL_DATASETFILES_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        default:
            return state;
    }
};
