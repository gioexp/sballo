import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    open: false
};

const LoginDialogReducer = createReducer(initialState, {
    'TOGGLE_LOGINDIALOG': (state, action) => {
        state.open = action.payload.open;
    },
})

export default LoginDialogReducer;