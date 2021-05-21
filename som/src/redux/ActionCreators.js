import * as ActionTypes from './ActionTypes';
import { backendUrl } from '../server/backendUrl';
import http from "../server/baseUrl";
import baseUrl from '../server/baseUrl';
/**
 * User
 */
export const login = (data) => (dispatch) => {
  return http.post('/login', JSON.stringify(data), {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
    .then(res => {
      //console.log(data.username); 
      if (res.data === data.username) {
        sessionStorage.setItem('verifiedUsername', res.data);
        dispatch(updateUser(res.data));// success
      }
      else {
        dispatch(updateUser(res));
      }

    })
    .catch((err) => console.log(err));

}
export const signUp = (data, cb) => (dispatch) => {

  return http.post('/sign-up', JSON.stringify(data), {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  }).then(res => {
    cb(res.data)
  })
    .catch((err) => console.log(err));
}
export const passwordChange = (data, cb) => (dispatch) => {
  return http.post('/passwordChange', JSON.stringify(data), {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  }).then(res => {
    cb(res.data)
  })
    .catch((err) => console.log(err));
}
export const updateUser = (userInfo) => ({
  type: ActionTypes.LOGIN,
  payload: userInfo
});

/**
 * Connect datasets and a model
 */
// uploading a new model file
export const connectUploading = (files, onUploadProgress, username) => (dispatch) => {
  console.log("connect start");
  // post the uploaded model to the backend server
  return http.post('/connect-upload', files, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  })
    .then(res => {
      console.log("this is response for connection uploading");
      console.log(res.data);
      dispatch(addConnections(res.data));
      dispatch(fetchUploadedModel(username));
      dispatch(fetchUploadedDataset(username));

    });
};

export const updateUploadingStatus = (status) => ({
  type: ActionTypes.UPDATE_UPLOADINGSTATUS,
  payload: status
});

export const clearConnectionFiles = () => (dispatch) => {
  dispatch(clearConnections());
}

export const clearConnections = () => ({
  type: ActionTypes.CLEAR_CONNECTIONS
});

export const addConnections = (filename) => ({
  type: ActionTypes.ADD_CONNECTIONS,
  payload: filename
});

export const bindModel = (modelname, username, datasetname) => (dispatch) => {
  console.log("bind start");
  return http.post('/bind-model', [modelname, username, datasetname], {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
    .then(res => {
      console.log("this is response for model binding");
      console.log(res);
    });
};

export const addBindedDatasets = (bindedDatasets) => ({
  type: ActionTypes.ADD_BINDDATASETS,
  payload: bindedDatasets
});

export const bindedDatasetsLoading = () => ({
  type: ActionTypes.BIND_LOADING
});

export const getBindedDatasets = (modelname, username) => (dispatch) => {
  console.log("start binded datasets");
  //dispatch(bindedDatasetsLoading(true));

  return http.post('/get-bindedDatasets', [modelname, username], {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
    .then(res => {
      console.log("this is response for bindedDatasets");
      console.log(res);
      dispatch(addBindedDatasets(res.data))
    });

};

export const removeOneBindedDataset = (datasetName) => ({
  type: ActionTypes.REMOVE_DATASET,
  payload: datasetName
});

// pass the filename to the backend server and tell it to delete corresponding dataset
export const deleteOneBindedDataset = (datasetName, userName) => (dispatch) => {
  return http.post('/delete-bindeddataset', JSON.stringify([datasetName, userName]), {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
    .then(res => {
      console.log("this is response for delete binded dataset");
      console.log(res);
      dispatch(removeOneBindedDataset(res.data));
      dispatch(removeOneDataset(res.data));
    })
    .catch((err) => console.log(err));
};

/**
 * Dataset
 */
// fetch datasets from the backend server
export const fetchDatasetFiles = (userName) => (dispatch) => {

  //dispatch(datasetFilesLoading(true));

  return http.post('/datasetFiles', JSON.stringify(userName), {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  }) // backend address: Localhost: 5000/datasetFiles
    .then(res => dispatch(addDatasetFiles(res.data))) // when the datasetFiles is obtained, we dispatch it into addDatasetFiles()
    .catch((err) => console.log(err));
}

export const datasetFilesLoading = () => ({
  type: ActionTypes.DATASETFILES_LOADING
});

export const datasetFilesFailed = (errmess) => ({
  type: ActionTypes.DATASETFILES_FAILED,
  payload: errmess
});

export const addDatasetFiles = (datasetFiles) => ({
  type: ActionTypes.ADD_DATASETFILES,
  payload: datasetFiles
});

export const addDataset = (dataset) => ({
  type: ActionTypes.UPLOAD_DATASET,
  payload: dataset
});

//show all dataset
export const checkQueryALLDatasets = (datasetFiles) => ({
  type: ActionTypes.QUERY_ALL_DATASETFILES,
  payload: datasetFiles
});

export const queryAllDatasets = (inputValue) => (dispatch) => {
  return http.post('/query-all-datasets', JSON.stringify(inputValue), {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
    .then(res => {
      console.log("this is response for querying all datasets");
      console.log(res.data);
      dispatch(checkQueryALLDatasets(res.data))
    })
    .catch((err) => console.log(err));
};

export const fetchAllDatasetFiles = () => (dispatch) => {

  dispatch(allDatasetFilesLoading(true));
  return fetch(backendUrl + 'alldatasetFiles') // backend address: Localhost: 5000/datasetFiles
    .then(response => response.json()) // when the promise resolved, we convert the incoming response into JSON by calling response.json
    .then(datasetFiles => dispatch(addAllDatasetFiles(datasetFiles))) // when the datasetFiles is obtained, we dispatch it into addDatasetFiles()
    .then(data => console.log(data));
}

export const allDatasetFilesLoading = () => ({
  type: ActionTypes.ALL_DATASETFILES_LOADING
});

export const allDatasetFilesFailed = (errmess) => ({
  type: ActionTypes.ALL_DATASETFILES_FAILED,
  payload: errmess
});

export const addAllDatasetFiles = (datasetFiles) => ({
  type: ActionTypes.ADD_ALL_DATASETFILES,
  payload: datasetFiles
});


// uploading a new dataset file
export const uploadDataset = (dataset, onUploadProgress, username) => (dispatch) => {
  // post the uploaded dataset to the backend server
  return http.post('/upload', dataset, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  })
    .then(res => {
      console.log("this is response for uploading dataset");
      console.log(res);
    })
    .then(res => {
      dispatch(fetchUploadedDataset(username));
    })
};

// get the uploded dataset info when the uploading is done in the backend
export const fetchUploadedDataset = (username) => (dispatch) => {
  console.log("start add new datasets");
  return http.post('/newDataset', JSON.stringify(username), {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
    .then(res => {
      console.log(res)
      dispatch(addDataset(res.data));
    })
};

export const removeOneDataset = (datasetName) => ({
  type: ActionTypes.REMOVE_DATASET,
  payload: datasetName
});

// pass the filename to the backend server and tell it to delete corresponding dataset
export const deleteOneDataset = (datasetName, userName) => (dispatch) => {
  return http.post('/delete-dataset', JSON.stringify([datasetName, userName]), {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
    .then(res => {
      console.log("this is response for delete dataset");
      console.log(res);
      dispatch(removeOneDataset(res.data));
    })
    .catch((err) => console.log(err));
};

//query datasets
export const checkQueryDatasets = (datasetFiles) => ({
  type: ActionTypes.QUERY_DATASETFILES,
  payload: datasetFiles
});

export const queryDatasets = (inputValue, userName) => (dispatch) => {
  return http.post('/query-datasets', JSON.stringify([inputValue, userName]), {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
    .then(res => {
      console.log("this is response for querying datasets");
      console.log(res.data);
      dispatch(checkQueryDatasets(res.data))
    })
    .catch((err) => console.log(err));
};

export const downloadFile = (datasetName, downloadName, downloadType, username) => (dispatch) => {
  console.log("start downloading");
  return http.post('/downloader', [datasetName, username, downloadType], {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
    .then(res => {
      console.log("this is response for downloading dataset");
      console.log(res);
      const element = document.createElement('a');
      const file = new Blob([res.data]);

      element.href = URL.createObjectURL(file);
      element.download = downloadName;
      document.body.appendChild(element);
      element.click();
    })

};


/**
 * Models
 */
// fetch models from the backend server
export const fetchAllModels = () => (dispatch) => {
  return fetch(backendUrl + 'allmodels') // backend address: Localhost: 5000/datasetFiles
    .then(response => response.json()) // when the promise resolved, we convert the incoming response into JSON by calling response.json
    .then(models => dispatch(addAllModels(models))) // when the datasetFiles is obtained, we dispatch it into addDatasetFiles()
    .then(data => console.log(data));
}

export const addAllModels = (models) => ({
  type: ActionTypes.ADD_ALL_MODELS,
  payload: models
});

export const fetchModelFiles = (userName, isLoading = true) => (dispatch) => {
  // test
  // return dispatch(addModelFiles(MODELFILES))
  //console.log("check loading: ", isLoading);
  //dispatch(modelFilesLoading(isLoading));

  return http.post('/modelFiles', JSON.stringify(userName), {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  }) // backend address: Localhost: 5000/modelFiles
    .then(res => {
      console.log(res)
      dispatch(addModelFiles(res.data))
    }) // when the modelFiles is obtained, we dispatch it into addModelFiles()
    .catch((err) => console.log(err));
}

export const modelFilesLoading = () => ({
  type: ActionTypes.MODELFILES_LOADING
});

export const modelFilesFailed = (errmess) => ({
  type: ActionTypes.MODELFILES_FAILED,
  payload: errmess
});

export const addModelFiles = (modelFiles) => ({
  type: ActionTypes.ADD_MODELFILES,
  payload: modelFiles
});

export const addModel = (model) => ({
  type: ActionTypes.UPLOAD_MODEL,
  payload: model
});

// uploading a new model file
export const uploadModel = (model, onUploadProgress, username) => (dispatch) => {
  // post the uploaded model to the backend server
  return http.post('/upload-model', model, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  })
    .then(res => {
      console.log("this is response model");
      console.log(res);
    })
    .then(res => {
      dispatch(fetchUploadedModel(username));
    })
};

// get the uploded model info when the uploading is done in the backend
export const fetchUploadedModel = (username) => (dispatch) => {
  return http.post('/newModel', JSON.stringify(username), {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
    .then(model => {
      console.log(model)
      dispatch(addModel(model.data));
    })
};

export const removeOneModel = (modelName) => ({
  type: ActionTypes.REMOVE_MODEL,
  payload: modelName
});

export const editOneModelDescription = (modelName, description) => ({
  type: ActionTypes.EDIT_MODEL_DESCRIPTION,
  payload: { modelName, description }
});

// pass the filename to the backend server and tell it to delete corresponding model
export const deleteOneModel = (modelName, userName) => (dispatch) => {
  console.log("delete model: ", [modelName])
  return http.post('/delete-model', JSON.stringify([modelName, userName]), {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
    .then(res => {
      console.log("this is response for delete model");
      console.log(res);
      dispatch(removeOneModel(res.data));
    })
    .catch((err) => console.log(err));
};

export const editModelDescription = (modelName, description, userName) => (dispatch) => {
  console.log("edit user name: ", userName)
  return http.post('/edit-model-desc', JSON.stringify({ modelName, description, userName }), {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
    .then(res => {
      console.log("this is response for edit model");
      console.log(res);
      dispatch(editOneModelDescription(modelName, description));
    })
    .catch((err) => console.log(err));
};

export const checkQueryALLModels = (models) => ({
  type: ActionTypes.QUERY_ALL_MODELS,
  payload: models
});

export const queryAllModels = (inputValue) => (dispatch) => {
  console.log("start query all models");
  return http.post('/query-all-models', JSON.stringify(inputValue), {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
    .then(res => {
      console.log("this is response for querying all models");
      console.log(res.data);
      dispatch(checkQueryALLModels(res.data))
    })
    .catch((err) => console.log(err));
};

//query datasets
export const checkQueryModels = (models) => ({
  type: ActionTypes.QUERY_MODELFILES,
  payload: models
});

export const queryModels = (inputValue, userName) => (dispatch) => {
  console.log("start query models");
  return http.post('/query-models', JSON.stringify([inputValue, userName]), {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
    .then(res => {
      console.log("this is response for querying models");
      console.log(res.data);
      dispatch(checkQueryModels(res.data))
    })
    .catch((err) => console.log(err));
};



/**
 * Metadata
 */
// submit metadata of a dataset
export const submitMetadata = (metadata) => (dispatch) => {
  return http.post('/submit-metadata', JSON.stringify(metadata), {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
    .then(res => {
      console.log("this is response for metadata");
      console.log(res);
      dispatch(addMetadata(res.data));
    })
    .catch((err) => console.log(err));
};

export const addMetadata = (metadata) => ({
  type: ActionTypes.ADD_METADATA,
  payload: metadata
});

export const addAllMetadata = (metadata) => ({
  type: ActionTypes.ADD_ALLMETADATA,
  payload: metadata
});

export const metadataFailed = (errmess) => ({
  type: ActionTypes.METADATA_FAILED,
  payload: errmess
});

export const metadataLoading = () => ({
  type: ActionTypes.METADATA_LOADING
});

export const allMetadataFailed = (errmess) => ({
  type: ActionTypes.ALLMETADATA_FAILED,
  payload: errmess
});

export const allMetadataLoading = () => ({
  type: ActionTypes.ALLMETADATA_LOADING
});

/**
 * Detailed data
 */
export const sendNameForDetailedData = (datasetName, userName) => (dispatch) => {
  console.log("start detailed loading");
  return http.post('/detailedData-name', JSON.stringify([datasetName, userName]), {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
    .then(res => {
      console.log("this is response for detailed data");
      console.log(res.data);
      dispatch(addDetailedData(res.data[0]));
      dispatch(addMetadata(res.data[1]));

      const datasetName = res.data[1][0].FileName;
      const briefInfo = res.data[1][0].BriefInfo;
      const briefInfo_datasetName = [datasetName, briefInfo];
      dispatch(modifyBriefInfo(briefInfo_datasetName));
    })
    .catch((err) => console.log(err));
}

export const modifyBriefInfo = (briefInfo_datasetName) => ({
  type: ActionTypes.MODIFY_BRIFINFO,
  payload: briefInfo_datasetName
});

export const addDetailedData = (detaileddata) => ({
  type: ActionTypes.ADD_DETAILEDDATA,
  payload: detaileddata
});

export const detailedDataFailed = (errmess) => ({
  type: ActionTypes.DETAILEDDATA_FAILED,
  payload: errmess
});

export const detailedDataLoading = () => ({
  type: ActionTypes.DETAILEDDATA_LOADING
});


export const addAllDetailedData = (detaileddata) => ({
  type: ActionTypes.ADD_ALLDETAILEDDATA,
  payload: detaileddata
});

export const detailedAllDataFailed = (errmess) => ({
  type: ActionTypes.ALLDETAILEDDATA_FAILED,
  payload: errmess
});

export const detailedAllDataLoading = () => ({
  type: ActionTypes.ALLDETAILEDDATA_LOADING
});

/**
 * UMatrix
 */

export const addUmatrixDatasets = (UmatrixDatasets) => ({
  type: ActionTypes.ADD_UMATRIXDATASETS,
  payload: UmatrixDatasets
});

export const cleanUmatrixDatasets = () => (dispatch) => {
  console.log("start clean umatrix");
  dispatch(addUmatrixDatasets([]))
}

export const getUMatrixDatasets = (modelname, username) => (dispatch) => {
  console.log("start umatrix datasets");
  //dispatch(bindedDatasetsLoading(true));

  return http.post('/get-umatrixDatasets', [modelname, username], {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
    .then(res => {
      console.log("this is response for bindedDatasets");
      console.log(res);
      dispatch(addUmatrixDatasets(res.data))
    });

};



