import { createStore, combineReducers } from 'redux';
import HallPageReducer from '../../components/HallPage/HallPageReducer';

const reducers = combineReducers({
  HallPageReducer
});

const store = createStore(reducers);

export default store;