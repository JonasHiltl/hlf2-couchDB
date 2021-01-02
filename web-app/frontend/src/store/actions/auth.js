import axios from 'axios';
import {
    REGISTER_SUCCESS,
    REGISTER_FAILED,
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILED,
    RESET_PASSWORD_CONFIRM_SUCCESS,
    RESET_PASSWORD_CONFIRM_FAILED,
    LOGOUT,
    LOGOUT_FAILED,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAILED,
    AUTHENTICATED_FAILED,
    AUTHENTICATED_SUCCESS
} from './types';

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
            });
        } else {
            dispatch({
                type: AUTHENTICATED_FAILED
            });
        }
    } catch (err) {
    dispatch({
        type: AUTHENTICATED_FAILED
    });
    }
};

export const login = (email, password) => async dispatch => {
    try {
        const res = await axios.post('http://localhost:3000/account/login', {
            email: email,
            password: password,
            withcredentials: true 
        });
        if (res.data.success === true) {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: LOGIN_FAILED,
                payload: res.data
            });
        }
    } catch (err) {
        dispatch({
            type: LOGIN_FAILED,
            payload: res.data
        });
    }
};

export const register = ( firstName, lastName, email, password ) => async dispatch => {
    try {
        const res = await axios.post('http://localhost:3000/account/register', {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            withcredentials: true
        });
        if (res.data.success === true) {
            dispatch ({
                type: REGISTER_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: REGISTER_FAILED,
                payload: res.data
            })
        }
    } catch (err) {
        dispatch({
            type: REGISTER_FAILED,
            payload: res.data
        })
    }
};

export const logout = () => dispatch => {
    try {
        const res = await axios.get('http://localhost:3000/account/logout', { withCredentials: true });
        if (res.data.success === true) {
            dispatch ({
                type: LOGOUT,
                payload: res.data
            })
        } else {
            dispatch({
                type: LOGOUT_FAILED,
                payload: res.data
            })
        }
    } catch (err) {
        dispatch({
            type: LOGOUT_FAILED,
            payload: res.data
        })
    }
}