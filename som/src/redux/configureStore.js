import {createStore, combineReducers, applyMiddleware} from 'redux';
import { createForms } from 'react-redux-form';
import { DatasetFiles } from './datasetFiles';
import { ModelFiles } from './modelFiles';
import { DetailedData } from './detailedData';
import { AllDatasetFiles } from './allDatasetFiles';
import { Metadata } from './metadata';
import { User } from './user';
import { ConnectionFiles } from './connectionResult';
import { AllModelFiles } from './allModels';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            user: User,
            datasetFiles: DatasetFiles,
            modelFiles: ModelFiles,
            detailedData: DetailedData,
            metadata: Metadata,
            allDatasetFiles: AllDatasetFiles,
            allModels: AllModelFiles,
            connectionFiles: ConnectionFiles
        }),
        // applyMiddleware can return store enhancer
        // after this, thunk and logger are available within the application
        applyMiddleware(thunk, logger)
    );

    return store;
}
