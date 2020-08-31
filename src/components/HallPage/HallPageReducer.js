import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    speed: 0
};

const HallPageReducer = createReducer(initialState, {
    'SET_SPEED': (state, action) => {
        state.speed = action.payload.speed;
    },
})

export default HallPageReducer;