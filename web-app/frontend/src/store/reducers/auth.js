import produce from 'immer';
import {
    REGISTER_SUCCESS,
    REGISTER_FAILED,
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    LOGOUT_SUCCESS,
    LOGOUT_FAILED,
    AUTHENTICATED_FAILED,
    AUTHENTICATED_SUCCESS,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAILED
} from '../actions/types';

const initialState = {
    isAuthenticated: false,
    user: [],
    successMessage: "",
    errorMessage: "",
    serverErrorMessage: "",
    success: undefined
};

export default function(state=initialState, action) {
    const { type, payload } = action;
    
    switch(type) {
        case REGISTER_SUCCESS:
            return produce(state, draft => {
                draft.success = true;
                draft.successMessage = payload.message;
                draft.user = payload.savedUser
            })
        case REGISTER_FAILED:
            return produce(state, draft => {
                draft.success = false;
                draft.errorMessage = payload.message;
                draft.successMessage = undefined
            })
        case AUTHENTICATED_SUCCESS:
            return produce(state, draft => {
                draft.isAuthenticated = true
            })
        case AUTHENTICATED_FAILED:
            return produce(state, draft => {
                draft.isAuthenticated = false;
                draft.successMessage = undefined;
            })
        case LOGIN_SUCCESS:
            return produce(state, draft => {
                draft.success = true;
                draft.successMessage = payload.message;
                draft.isAuthenticated = true
            })
        case LOGIN_FAILED:
            return produce(state, draft => {
                draft.success = false;
                draft.errorMessage = payload.message;
                draft.successMessage = undefined;
                draft.isAuthenticated = false
            })
        case LOGOUT_SUCCESS:
            return produce(state, draft => {
                draft.success = true;
                draft.successMessage = payload.message
            })
        case LOGOUT_FAILED:
            return produce(state, draft => {
                draft.success = false;
                draft.errorMessage = payload.message;
                draft.successMessage = undefined
            })
        default:
            return state
    }
}