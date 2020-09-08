import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    open: false,
    user: undefined,
    userDetails: undefined
};

const LoginDialogReducer = createReducer(initialState, {
    'TOGGLE_LOGINDIALOG': (state, action) => {
        state.open = action.payload.open;
    },
    'SET_USERLOGGEDIN': (state, action) => {
        state.user = action.payload.user;
    },
    'SET_USERDETAILS': (state, action) => {
        state.userDetails = action.payload.userDetails;
    },
})

export default LoginDialogReducer;