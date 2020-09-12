import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    open: false,
    id: undefined,
    mode: 'confirm',
    table: undefined
};

const TableConfirmDialogReducer = createReducer(initialState, {
    'TOGGLE_TABLECONFIRMDIALOG': (state, action) => {
        state.open = action.payload.open;
    },
    'SET_TABLECONFIRMDIALOG_ID': (state, action) => {
        state.id = action.payload.id;
    },
    'SET_TABLECONFIRMDIALOG_MODE': (state, action) => {
        state.mode = action.payload.mode;
    },
    'SET_TABLECONFIRMDIALOG_TABLE': (state, action) => {
        state.table = action.payload.table;
    },
})

export default TableConfirmDialogReducer;