import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    tables: null,
    tablesHistory: null
};

const HallPageReducer = createReducer(initialState, {
    'SET_TABLES': (state, action) => {
        state.tables = action.payload.tables;
    },
    'SET_TABLES_HISTORY': (state, action) => {
        state.tablesHistory = action.payload.tablesHistory;
    },
})

export default HallPageReducer;