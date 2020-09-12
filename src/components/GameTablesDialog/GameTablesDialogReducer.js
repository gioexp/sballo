import { createReducer } from '@reduxjs/toolkit';
import moment from 'moment';

const initialState = {
    open: false,
    countdowns: []
};

const GameTablesDialogReducer = createReducer(initialState, {
    'TOGGLE_GAMETABLESDIALOG': (state, action) => {
        state.open = action.payload.open;
    },
    'SET_GAMETABLESDIALOG_COUNTDOWNS': (state, action) => {
        let val = state.countdowns.filter(el => el.key === action.payload.countdownsObj.key);
        if (val.length > 0) {
            let i = state.countdowns.map(el => el.key).indexOf(action.payload.countdownsObj.key);
            let secondLeft = moment(new Date(action.payload.countdownsObj.started)).diff(moment().utc(), 'seconds');
            state.countdowns[i] = { key: val[0].key, value: secondLeft };
        }
        else {
            let secondLeft = moment(new Date(action.payload.countdownsObj.started)).diff(moment().utc(), 'seconds');
            let newObj = { key: action.payload.countdownsObj.key, value: secondLeft };
            state.countdowns.push(newObj);
        }
    },
})

export default GameTablesDialogReducer;