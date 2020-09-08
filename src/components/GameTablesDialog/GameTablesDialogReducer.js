import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    open: false
};

const GameTablesDialogReducer = createReducer(initialState, {
    'TOGGLE_GAMETABLESDIALOG': (state, action) => {
        state.open = action.payload.open;
    },
})

export default GameTablesDialogReducer;