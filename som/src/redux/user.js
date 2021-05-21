import * as ActionTypes from './ActionTypes';

export const User = (state = {
    isLoading: true,
    errMess: null,
    userInfo: null
}, action) => {
    switch (action.type) {
        case ActionTypes.LOGIN:

          return { ...state, isLoading: false, userInfo: action.payload };

        case ActionTypes.SIGN_UP:
            return { ...state }


        default:
            return state;
    }
};
