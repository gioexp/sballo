import { createStore, combineReducers } from 'redux';
import HallPageReducer from '../../components/HallPage/HallPageReducer';
import CreateTableDialogReducer from '../../components/CreateTableDialog/CreateTableDialogReducer';

const reducers = combineReducers({
  HallPageReducer,
  CreateTableDialogReducer
});

const store = createStore(reducers);

export default store;