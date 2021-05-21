export const LOGIN = 'LOGIN';
export const SIGN_UP = 'SIGN_UP';

export const ADD_UMATRIXDATASETS = 'ADD_UMATRIXDATASETS';

export const ADD_CONNECTIONS = 'ADD_CONNECTIONS'; // add connection files into the redux store
export const CLEAR_CONNECTIONS = "CLEAR_CONNECTIONS";
export const ADD_BINDDATASETS = 'ADD_BINDDATASETS';
export const BIND_LOADING = 'BIND_LOADING';
export const REMOVE_BIND = 'REMOVE_BIND';
export const UPDATE_UPLOADINGSTATUS = 'UPDATE_UPLOADINGSTATUS';

export const DATASETFILES_LOADING = 'DATASETFILES_LOADING'; // means the datasets are currently being fetched, maybe from a server
export const DATASETFILES_FAILED = 'DATASETFILES_FAILED'; // means you fail to fetch dataset information from a server
export const ADD_DATASETFILES = 'ADD_DATASETFILES'; // you wanna add datasets into your Redux store
export const QUERY_DATASETFILES = 'QUERY_DATASETFILES';
export const UPLOAD_DATASET = 'UPLOAD_DATASET'; // add the uploaded dataset to the Redux store
export const REMOVE_DATASET = 'REMOVE_DATASET'; // remove the selected dataset in the Redux store
export const MODIFY_BRIFINFO = 'MODIFY_BRIFINFO';

export const ADD_ALL_DATASETFILES = 'ADD_ALL_DATASETFILES';
export const ALL_DATASETFILES_LOADING = 'ALL_DATASETFILES_LOADING';
export const ALL_DATASETFILES_FAILED = 'ALL_DATASETFILES_FAILED';//show all dataset
export const QUERY_ALL_DATASETFILES = 'QUERY_ALL_DATASETFILES';

export const ADD_ALL_MODELS = 'ADD_ALL_MODELS';
export const QUERY_ALL_MODELS = 'QUERY_ALL_MODELS';
export const ALL_MODELS_LOADING = 'ALL_MODELS_LOADING';
export const ALL_MODELS_FAILED = 'ALL_MODELS_FAILED';//show all dataset

export const MODELFILES_LOADING = 'MODELFILES_LOADING'; // means the models are currently being fetched, maybe from a server
export const MODELFILES_FAILED = 'MODELFILES_FAILED'; // means you fail to fetch model information from a server
export const ADD_MODELFILES = 'ADD_MODELFILES'; // you wanna add models into your Redux store
export const QUERY_MODELFILES = 'QUERY_MODELFILES';
export const UPLOAD_MODEL = 'UPLOAD_MODEL'; // add the uploaded model to the Redux store
export const REMOVE_MODEL = 'REMOVE_MODEL'; // remove the selected model in the Redux store
export const EDIT_MODEL_DESCRIPTION = 'EDIT_MODEL_DESCRIPTION';

export const SUBMIT_METADATA = 'SUBMIT_METADATA'; // post the metadata to the backend server
export const METADATA_LOADING = 'METADATA_LOADING';
export const METADATA_FAILED = 'METADATA_FAILED';
export const ADD_METADATA = 'ADD_METADATA'; // add the metadata to the Redux store

export const ADD_ALLMETADATA = 'ADD_ALLMETADATA';
export const ALLMETADATA_LOADING = 'ALLMETADATA_LOADING';
export const ALLMETADATA_FAILED = 'ALLMETADATA_FAILED';

export const ADD_ALLDETAILEDDATA = 'ADD_ALLDETAILEDDATA';
export const ALLDETAILEDDATA_LOADING = 'ALLDETAILEDDATA_LOADING';
export const ALLDETAILEDDATA_FAILED = 'ALLDETAILEDDATA_FAILED';

export const ADD_DETAILEDDATA = 'ADD_DETAILEDDATA'; // add thedetailed data in a dataset into the Redux store
export const DETAILEDDATA_LOADING = 'DETAILEDDATA_LOADING';
export const DETAILEDDATA_FAILED = 'DETAILEDDATA_FAILED';

