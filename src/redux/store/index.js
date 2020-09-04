import { createStore, combineReducers } from 'redux';
import HallPageReducer from '../../components/HallPage/HallPageReducer';
import CreateTableDialogReducer from '../../components/CreateTableDialog/CreateTableDialogReducer';
import SnackbarReducer from '../../components/Snackbar/SnackbarReducer';
import TableConfirmDialogReducer from '../../components/TableConfirmDialog/TableConfirmDialogReducer';
import LoginDialogReducer from '../../components/LoginDialog/LoginDialogReducer'; 

const reducers = combineReducers({
  HallPageReducer,
  CreateTableDialogReducer,
  SnackbarReducer,
  TableConfirmDialogReducer,
  LoginDialogReducer
});

const store = createStore(reducers);

export default store;