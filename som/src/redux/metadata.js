import * as ActionTypes from './ActionTypes';
import {emptyMetadata} from './metadataEmpty';

export const Metadata = (state = {
    isLoading: true,
    errMess: null,
    metadata: emptyMetadata
}, action) => {

    switch (action.type) {
        case ActionTypes.ADD_METADATA:
            return { ...state, isLoading: false, errMess: null, metadata: action.payload };

        case ActionTypes.METADATA_LOADING:
            return { ...state, isLoading: true, errMess: null, metadata: emptyMetadata }

        case ActionTypes.METADATA_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        default:
            return state;
    }
};