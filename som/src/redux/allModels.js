import * as ActionTypes from './ActionTypes';

export const AllModelFiles = (state = {
    isLoading: true,
    errMess: null,
    isQuery: false,
    modelFiles: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_ALL_MODELS:
            console.log("add all models: ", action.payload);
            return { ...state, isLoading: false, errMess: null, isQuery: false, modelFiles: action.payload };
        
        case ActionTypes.QUERY_ALL_MODELS:
            return { ...state, isLoading: false, errMess: null, isQuery: true, modelFiles: action.payload };

        default:
            return state;
    }
};
