import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    loaded: true
};

const HeaderReducer = createReducer(initialState, {
    'TOGGLE_USERIMAGELOADED': (state, action) => {
        state.loaded = action.payload.loaded;
    }
})

export default HeaderReducer;