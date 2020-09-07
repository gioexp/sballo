import React from 'react';
import MuiSnackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSnackbarOpen } from './SnackbarAction';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        top: "9.5%",
        width: '15%'
    },
  }));

function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}

function Snackbar() {
    const classes = useStyles();
    const dispatch = useDispatch();

    const open = useSelector(state => state.SnackbarReducer.open);
    const message = useSelector(state => state.SnackbarReducer.message);
    const severity = useSelector(state => state.SnackbarReducer.severity);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(toggleSnackbarOpen(false));
    };

    return (
        <div>
            <MuiSnackbar open={open} autoHideDuration={10000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} classes={{root: classes.root}}>
                <Alert onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </MuiSnackbar>
        </div>
    );
}

export default Snackbar;