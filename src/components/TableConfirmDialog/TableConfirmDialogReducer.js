import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    open: false,
    id: undefined
};

const TableConfirmDialogReducer = createReducer(initialState, {
    'TOGGLE_TABLECONFIRMDIALOG': (state, action) => {
        state.open = action.payload.open;
    },
    'SET_TABLECONFIRMDIALOG_ID': (state, action) => {
        state.id = action.payload.id;
    },
})

export default TableConfirmDialogReducer;