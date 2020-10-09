import React, { useState } from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, LinearProgress, Typography
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTableConfirmDialog } from './TableConfirmDialogAction';
import { insertTableParticipantsFirebase, deleteFirebase, removeTableParticipantsFirebase } from '../../libs/firebaseRedux';
import { toggleSnackbarOpen, setSnackbarMessage, setSnackbarSeverity } from '../Snackbar/SnackbarAction';
import { useStyles } from './TableConfirmDialogCss';
import { MAX_TABLES_PER_PLAYER } from '../../libs/constants';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function TableConfirmDialog() {
    const classes = useStyles();
    const open = useSelector(state => state.TableConfirmDialogReducer.open);
    const id = useSelector(state => state.TableConfirmDialogReducer.id);
    const mode = useSelector(state => state.TableConfirmDialogReducer.mode);
    const table = useSelector(state => state.TableConfirmDialogReducer.table); // this is necessary because on table delete tabels[id] becomes undefined
    const tables = useSelector(state => state.HallPageReducer.tables);
    const user = useSelector(state => state.LoginDialogReducer.user);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        dispatch(toggleTableConfirmDialog(false));
    };

    const joinTable = () => {
        if (tables[id].participants.length < tables[id].players) {
            if (Object.entries(tables).filter(([key, table]) => table.participants.includes(user.uid)).length < MAX_TABLES_PER_PLAYER) {
                setLoading(true);
                insertTableParticipantsFirebase(id, user.uid, tables[id].players)
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
                dispatch(setSnackbarMessage('You cannot join more than ' + MAX_TABLES_PER_PLAYER + ' tables at the same time! Sorry'));
                dispatch(setSnackbarSeverity('warning'));
                dispatch(toggleSnackbarOpen(true));
                dispatch(toggleTableConfirmDialog(false));
            }
        }
        else {
            dispatch(setSnackbarMessage('Table is full. Try with another one.'));
            dispatch(setSnackbarSeverity('warning'));
            dispatch(toggleSnackbarOpen(true));
            dispatch(toggleTableConfirmDialog(false));
        }
    };

    const deleteTable = () => {
        setLoading(true);
        deleteFirebase('tables', id)
            .then(() => {
                dispatch(setSnackbarMessage('Tables deleted!'));
                dispatch(setSnackbarSeverity('success'));
                dispatch(toggleSnackbarOpen(true));
                dispatch(toggleTableConfirmDialog(false));
                setLoading(false);
            })
            .catch(error => {
                dispatch(setSnackbarMessage('Error while teleting table. Retry later...'));
                dispatch(setSnackbarSeverity('error'));
                dispatch(toggleSnackbarOpen(true));
                dispatch(toggleTableConfirmDialog(false));
                setLoading(false);
            });
    };

    const leaveTable = () => {
        setLoading(true);
        removeTableParticipantsFirebase(id, user.uid)
            .then(result => {
                if (result.committed) {
                    dispatch(setSnackbarMessage('Table left. See you next time!'));
                    dispatch(setSnackbarSeverity('success'));
                }
                else {
                    dispatch(setSnackbarMessage('Table not left. Retry later...'));
                    dispatch(setSnackbarSeverity('warning'));
                }
                dispatch(toggleSnackbarOpen(true));
                dispatch(toggleTableConfirmDialog(false));
                setLoading(false);
            })
            .catch(error => {
                dispatch(setSnackbarMessage('Error while leaving table. Retry later...'));
                dispatch(setSnackbarSeverity('error'));
                dispatch(toggleSnackbarOpen(true));
                dispatch(toggleTableConfirmDialog(false));
                setLoading(false);
            });
    };

    const handleConfirm = () => {
        if (mode === 'confirm') joinTable();
        if (mode === 'delete') deleteTable();
        if (mode === 'leave') leaveTable();
    };

    return (
        <div>
            {tables && table && id && mode &&
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    onClose={handleClose}
                    fullWidth={true}
                    maxWidth={'xs'}>
                    <DialogTitle className={classes.title}>
                        <div>
                            {mode === 'confirm' && (table.name + ' confirmation')}
                            {mode === 'delete' && (table.name + ' delete')}
                            {mode === 'leave' && (table.name + ' leave')}
                            {loading && <LinearProgress className={classes.loadingBar} />}
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        {mode === 'confirm' && <Typography>Are you sure joining '{table.author}' table?</Typography>}
                        {mode === 'delete' && <Typography>Are you sure delete '{table.name}' table? Action cannot be undone.</Typography>}
                        {mode === 'leave' && <Typography>Are you sure leave '{table.name}' table?</Typography>}
                        <div className={classes.buttonConfirmDiv}>
                            <Button onClick={handleConfirm} className={classes.buttonConfirm} variant="contained" color="primary" disabled={loading}>
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