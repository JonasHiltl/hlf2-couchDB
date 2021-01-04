import produce from 'immer';
import {
    AUTHENTICATED_FAILED,
    AUTHENTICATED_SUCCESS,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAILED,
} from '../actions/types';

const initialState = {
    isAuthenticated: false,
    user: [],
    success: undefined
};

export default function(state=initialState, action) {
    const { type, payload } = action;
    
    switch(type) {
        case AUTHENTICATED_SUCCESS:
            return produce(state, draft => {
                draft.isAuthenticated = true;
            })
        case AUTHENTICATED_FAILED:
            return produce(state, draft => {
                draft.isAuthenticated = false;
            })
        case USER_LOADED_SUCCESS:
            return produce(state, draft => {
                draft.success = true;
                draft.user = payload.user;
            })
        case USER_LOADED_FAILED:
            return produce(state, draft => {
                draft.success = false;
            })
        default:
            return state
    }
}