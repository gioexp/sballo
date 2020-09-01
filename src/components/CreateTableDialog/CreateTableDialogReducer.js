import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    open: false
};

const CreateTableDialogReducer = createReducer(initialState, {
    'TOGGLE_CREATETABLEDIALOG': (state, action) => {
        state.open = action.payload.open;
    },
})

export default CreateTableDialogReducer;