import React, { useState } from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, LinearProgress, Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTableConfirmDialog } from './TableConfirmDialogAction';
import { updateTableParticipantsFirebase } from '../../libs/firebaseRedux';
import { toggleSnackbarOpen, setSnackbarMessage, setSnackbarSeverity } from '../Snackbar/SnackbarAction';

const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.primary.main,
    },
    actionButton: {
        textTransform: 'none'
    },
    loadingBar: {
        width: '100%',
    },
    buttonConfirmDiv: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '2em'
    },
    buttonConfirm: {
        width: '50%'
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function TableConfirmDialog() {
    const classes = useStyles();
    const open = useSelector(state => state.TableConfirmDialogReducer.open);
    const id = useSelector(state => state.TableConfirmDialogReducer.id);
    const tables = useSelector(state => state.HallPageReducer.tables);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        dispatch(toggleTableConfirmDialog(false));
    };

    const handleConfirm = () => {
        if (tables[id].participants.length < tables[id].players) {
            setLoading(true);
            updateTableParticipantsFirebase(id, 'id-user', tables[id].players)  // here the joiner username
                .then(result => {
                    if (result.committed) {
                        dispatch(setSnackbarMessage('Table joined. Good luck!'));
                        dispatch(setSnackbarSeverity('success'));
                    }
                    else {
                        dispatch(setSnackbarMessage('Table is full. Try with another one.'));
                        dispatch(setSnackbarSeverity('warning'));
                    }
                    dispatch(toggleSnackbarOpen(true));
                    dispatch(toggleTableConfirmDialog(false));
                    setLoading(false);
                })
                .catch(error => {
                    dispatch(setSnackbarMessage('Error while joining table. Retry later...'));
                    dispatch(setSnackbarSeverity('error'));
                    dispatch(toggleSnackbarOpen(true));
                    dispatch(toggleTableConfirmDialog(false));
                    setLoading(false);
                });
        }
        else {
            dispatch(setSnackbarMessage('Table is full. Try with another one.'));
            dispatch(setSnackbarSeverity('warning'));
            dispatch(toggleSnackbarOpen(true));
            dispatch(toggleTableConfirmDialog(false));
        }
    }

    return (
        <div>
            {(tables && id) &&
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    fullWidth={true}
                    maxWidth={'xs'}>
                    <DialogTitle className={classes.title}>
                        <div>
                            {tables[id].name + ' confirmation'}
                            {loading && <LinearProgress className={classes.loadingBar} />}
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure joining '{tables[id].author}' table?</Typography>
                        <div className={classes.buttonConfirmDiv}>
                            <Button onClick={handleConfirm} className={classes.buttonConfirm} variant="contained" color="primary">
                                Confirm
                            </Button>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button className={classes.actionButton} onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>}
        </div>
    );
}

export default TableConfirmDialog;