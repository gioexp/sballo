import React, { useState } from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, LinearProgress, Typography, FormControl, FormControlLabel,
    TextField, FormHelperText
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { toggleLoginDialog } from './LoginDialogAction';
import { toggleSnackbarOpen, setSnackbarMessage, setSnackbarSeverity } from '../Snackbar/SnackbarAction';
import clsx from 'clsx';

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
    formControl: {
        width: '100%',
    },
    marginBottom: {
        marginBottom: '1em'
    },
    textField: {
        width: '100%',
        marginRight: 0,
        marginLeft: 0
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

function LoginDialog() {
    const classes = useStyles();
    const open = useSelector(state => state.LoginDialogReducer.open);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, stPassword] = useState('');
    const dispatch = useDispatch();

    const emailFormError = false;

    const handleClose = () => {
        dispatch(toggleLoginDialog(false));
    };

    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                fullWidth={true}
                maxWidth={'sm'}>
                <DialogTitle className={classes.title}>
                    <div>
                        {'Login'}
                        {loading && <LinearProgress className={classes.loadingBar} />}
                    </div>
                </DialogTitle>
                <DialogContent>
                    <FormControl required error={emailFormError} component="fieldset" className={clsx(classes.formControl, classes.marginBottom)} >
                        <FormControlLabel className={classes.textField} control={
                            <TextField
                                label="Email"
                                className={classes.textField}
                                required
                                error={emailFormError}
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />} />
                        {emailFormError && <FormHelperText>Invalid email format</FormHelperText>}
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button className={classes.actionButton} onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button variant="contained" className={classes.actionButton} onClick={handleClose} color="primary">
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default LoginDialog;