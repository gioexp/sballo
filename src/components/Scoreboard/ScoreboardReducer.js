import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    open: [],
};

const ScoreboardReducer = createReducer(initialState, {
    'TOGGLE_SCOREBOARD': (state, action) => {
        let val = state.open.filter(el => el.key === action.payload.openObj.key);
        if (val.length > 0) {
            let i = state.open.map(el => el.key).indexOf(action.payload.openObj.key);
            state.open[i] = action.payload.openObj;
        }
        else state.open.push(action.payload.openObj);
    },
})

export default ScoreboardReducer;