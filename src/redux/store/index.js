import { createStore, combineReducers } from 'redux';
import HallPageReducer from '../../components/HallPage/HallPageReducer';
import CreateTableDialogReducer from '../../components/CreateTableDialog/CreateTableDialogReducer';
import SnackbarReducer from '../../components/Snackbar/SnackbarReducer';
import TableConfirmDialogReducer from '../../components/TableConfirmDialog/TableConfirmDialogReducer';
import LoginDialogReducer from '../../components/LoginDialog/LoginDialogReducer'; 
import HeaderReducer from '../../components/Header/HeaderReducer';
import GameTablesDialogReducer from '../../components/GameTablesDialog/GameTablesDialogReducer';
import ScoreboardReducer from '../../components/Scoreboard/ScoreboardReducer';

const reducers = combineReducers({
  HallPageReducer,
  CreateTableDialogReducer,
  SnackbarReducer,
  TableConfirmDialogReducer,
  LoginDialogReducer,
  HeaderReducer,
  GameTablesDialogReducer,
  ScoreboardReducer
});

const store = createStore(reducers);

export default store;