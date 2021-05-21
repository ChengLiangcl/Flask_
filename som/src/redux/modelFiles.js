import * as ActionTypes from './ActionTypes';

export const ModelFiles = (state = {
    isLoading: true,
    isQuery: false,
    errMess: null,
    modelFiles: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_MODELFILES:
            console.log("I wanna check model file");
            return { ...state, isLoading: false, errMess: null, isQuery: false, modelFiles: action.payload };

        case ActionTypes.QUERY_MODELFILES:
            return { ...state, isLoading: false, errMess: null, isQuery: true, modelFiles: action.payload };

        case ActionTypes.MODELFILES_LOADING:
            return { ...state, isLoading: true, errMess: null, modelFiles: [] }

        case ActionTypes.MODELFILES_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        case ActionTypes.UPLOAD_MODEL:
            var model = action.payload; // get the uploaded model
            return { ...state, modelFiles: [...state.modelFiles, ...model] };

        case ActionTypes.REMOVE_MODEL:
            console.log("start delete");
            var modelName = action.payload; // to get the filename of the selected model
            let deletedIndex = 0; // to find the corresponding index based on filename
            console.log("get model is " + modelName);
            for (let [index, eachModel] of Object.entries(state.modelFiles)) {
                if (eachModel.FileName === modelName) {
                    deletedIndex = parseInt(index, 10);
                }
            }

            console.log("deletedIndex is " + deletedIndex);

            const newModel = [
                ...state.modelFiles.slice(0, deletedIndex),
                ...state.modelFiles.slice(deletedIndex + 1, state.modelFiles.length)];

            return { ...state, modelFiles: newModel };

        case ActionTypes.EDIT_MODEL_DESCRIPTION:
            console.log("start edit");
            var { modelName, description } = action.payload;
            console.log("my modelname:", modelName);
            console.log("my description:", description)
            state.modelFiles.forEach(item => {
                if (item.FileName === modelName) {
                    item.BriefInfo = description
                }
            })

            const updatedModel = state.modelFiles.map(item => {
                if (item.FileName === modelName) {
                    item.BriefInfo = description
                    return item
                } else {
                    return item
                }
            });

            console.log("new modelFile: ", updatedModel)
            return { ...state, modelFiles: updatedModel };

        default:
            return state;
    }
};
