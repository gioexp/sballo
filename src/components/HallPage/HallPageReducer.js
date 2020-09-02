import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    tables: null
};

const HallPageReducer = createReducer(initialState, {
    'SET_TABLES': (state, action) => {
        state.tables = action.payload.tables;
    },
})

export default HallPageReducer;