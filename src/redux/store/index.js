import { createStore, combineReducers } from 'redux';
import HallPageReducer from '../../components/HallPage/HallPageReducer';
import CreateTableDialogReducer from '../../components/CreateTableDialog/CreateTableDialogReducer';
import SnackbarReducer from '../../components/Snackbar/SnackbarReducer';

const reducers = combineReducers({
  HallPageReducer,
  CreateTableDialogReducer,
  SnackbarReducer
});

const store = createStore(reducers);

export default store;