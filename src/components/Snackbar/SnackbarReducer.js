import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    open: false,
    message: '',
    severity: 'success'
};

const SnackbarReducer = createReducer(initialState, {
    'TOGGLE_SNACKBAR_OPEN': (state, action) => {
        state.open = action.payload.open;
    },
    'SET_SNACKBAR_MESSAGE': (state, action) => {
        state.message = action.payload.message;
    },
    'SET_SNACKBAR_SEVERITY': (state, action) => {
        state.severity = action.payload.severity;
    },
})

export default SnackbarReducer;