import axios from 'axios';
import {
    USER_LOADED_SUCCESS,
    USER_LOADED_FAILED,
    AUTHENTICATED_FAILED,
    AUTHENTICATED_SUCCESS,
} from './types';
axios.defaults.withCredentials = true;

export const checkAuthenticated = () => async dispatch => {
    if (typeof window == 'undefined') {
        dispatch({
            type: AUTHENTICATED_FAILED
        });
    }
    try {
        const res = await axios.get('http://localhost:3000/account/verify', {withcredentials: true})

        if (res.data.msg !== 'Token is not valid') {
            dispatch({
                type: AUTHENTICATED_SUCCESS,
                payload: res.data
            });
            dispatch(loadUser());
        } else {
            dispatch({
                type: AUTHENTICATED_FAILED,
                payload: res.data
            });
        }
    } catch (err) {
        dispatch({
            type: AUTHENTICATED_FAILED,
            payload: err
        });
    }
};

export const loadUser = () => async dispatch => {
    try {
        const res = await axios.get('http://localhost:3000/account/users/me', {withcredentials: true});
        if (res.data.success === true) {
            dispatch ({
                type: USER_LOADED_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: USER_LOADED_FAILED
            })
        }
    } catch (err) {
        dispatch({
            type: USER_LOADED_FAILED,
            payload: err
        });
    }
};