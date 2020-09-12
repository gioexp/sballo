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
import { VALID_EMAIL, VALID_PASSWORD, NICKNAME_MIN_LENGTH, NICKNAME_MAX_LENGTH, USER_NOT_FOUND, WRONG_PASSWORD, START_POINTS } from '../../libs/constants';
import { createUser, updateUserProfile, sendEmailVerification, login, sendPasswordResetEmail, insertFirebase } from '../../libs/firebaseRedux';

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
    emailMarginBottom: {
        marginBottom: '1em'
    },
    passwordMarginBottom: {
        marginBottom: '2em'
    },
    textField: {
        width: '100%',
        marginRight: 0,
        marginLeft: 0
    },
    signInDiv: {
        display: 'inline-flex',
        alignItems: 'center'
    },
    newPasswordMarginBottom: {
        marginBottom: '1em'
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

function LoginDialog() {
    const classes = useStyles();
    const open = useSelector(state => state.LoginDialogReducer.open);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signIn, setSignIn] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [repeatNewPassword, setRepeatNewPassword] = useState('');
    const [nickName, setNickname] = useState('');
    const dispatch = useDispatch();

    const emailFormError = !(email.length === 0) && (email.length > 0 && !VALID_EMAIL.test(email));
    const passwordFormError = !(password.length === 0) && (password.length > 0 && !VALID_PASSWORD.test(password));
    const newPasswordFormError = !(newPassword.length === 0) && (newPassword.length > 0 && !VALID_PASSWORD.test(newPassword));
    const repeatNewPasswordFormError = !(repeatNewPassword.length === 0) && (repeatNewPassword.length > 0 && newPassword !== repeatNewPassword);
    const nickNameFormError = !(nickName.length === 0) && (nickName.length > 0 && (nickName.length < NICKNAME_MIN_LENGTH || nickName.length > NICKNAME_MAX_LENGTH));

    const handleClose = () => {
        dispatch(toggleLoginDialog(false));
        setPassword('');
        setNewPassword('');
        setRepeatNewPassword('');
        setNickname('');
        if (signIn) {
            setTimeout(() => {
                setSignIn(false);
            }, 500);
        }
    };

    const handleLogin = () => {
        setLoading(true);
        login(email, password)
            .then(() => {
                handleClose();
                setLoading(false);
            })
            .catch(error => {
                dispatch(setSnackbarMessage(getLoginErrorMessage(error.code)));
                dispatch(setSnackbarSeverity('error'));
                dispatch(toggleSnackbarOpen(true));
                setLoading(false);
            })
    };

    const getLoginErrorMessage = (errorCode) => {
        let message = '';
        switch (errorCode) {
            case USER_NOT_FOUND:
                message = 'User not found. Check your email and try again. Don\'t have an account? Click on Sign In.';
                break;
            case WRONG_PASSWORD:
                message = 'You typed a wrong password. Check it and try again.'
                break;
            default:
                message = 'Error while logging in. Retry later...';
                break;
        }
        return message;
    };

    const handleSignin = () => {
        setLoading(true);
        createUser(email, newPassword)
            .then(result => {
                updateUserProfile(result.user, nickName)
                    .then(() => {
                        let userDetail = { uid: result.user.uid, points: START_POINTS, displayName: nickName };
                        insertFirebase('userDetails', userDetail)
                            .then(() => {
                                sendEmailVerification(result.user)
                                    .then(() => {
                                        dispatch(setSnackbarMessage('User created! We sent you an email. Please, verify your credential clicking on link in email. Thanks!'));
                                        dispatch(setSnackbarSeverity('success'));
                                        dispatch(toggleSnackbarOpen(true));
                                        handleClose();
                                        setLoading(false);
                                    })
                                    .catch(error => {
                                        dispatch(setSnackbarMessage('Error while sending verification email. Retry later...'));
                                        dispatch(setSnackbarSeverity('error'));
                                        dispatch(toggleSnackbarOpen(true));
                                        handleClose();
                                        setLoading(false);
                                    });
                            })
                            .catch(error => {
                                dispatch(setSnackbarMessage('Error while creating user detail data. Retry later...'));
                                dispatch(setSnackbarSeverity('error'));
                                dispatch(toggleSnackbarOpen(true));
                                handleClose();
                                setLoading(false);
                            });
                    })
                    .catch(error => {
                        dispatch(setSnackbarMessage('Error while updating user profile. Retry later...'));
                        dispatch(setSnackbarSeverity('error'));
                        dispatch(toggleSnackbarOpen(true));
                        handleClose();
                        setLoading(false);
                    });
            })
            .catch(error => {
                dispatch(setSnackbarMessage('Error while creating user. Retry later...'));
                dispatch(setSnackbarSeverity('error'));
                dispatch(toggleSnackbarOpen(true));
                handleClose();
                setLoading(false);
            });
    };

    const sendResetPasswordEmail = () => {
        setLoading(true);
        sendPasswordResetEmail(email)
            .then(() => {
                dispatch(setSnackbarMessage('Reset password email sent! Please, verify your inbox and click on reset link. Thanks!'));
                dispatch(setSnackbarSeverity('success'));
                dispatch(toggleSnackbarOpen(true));
                handleClose();
                setLoading(false);
            })
            .catch(error => {
                dispatch(setSnackbarMessage('Error while sending reset password email. Retry later...'));
                dispatch(setSnackbarSeverity('error'));
                dispatch(toggleSnackbarOpen(true));
                handleClose();
                setLoading(false);
            });
    }

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
                        {signIn ? 'Sign In' : 'Login'}
                        {loading && <LinearProgress className={classes.loadingBar} />}
                    </div>
                </DialogTitle>
                <DialogContent>
                    {!signIn &&
                        <div>
                            <FormControl required error={emailFormError} component="fieldset" className={clsx(classes.formControl, classes.emailMarginBottom)} >
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
                            <FormControl required error={passwordFormError} component="fieldset" className={clsx(classes.formControl, classes.passwordMarginBottom)} >
                                <FormControlLabel className={classes.textField} control={
                                    <TextField
                                        label="Password"
                                        className={classes.textField}
                                        required
                                        type="password"
                                        error={passwordFormError}
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                    />} />
                                {passwordFormError && <FormHelperText>Password must be 8-chars length, 1 char up and low, 1 number and 1 special char !@#$%^&*_?</FormHelperText>}
                            </FormControl>
                            <div className={classes.signInDiv}>
                                <Typography variant="body2">Don't have an account?</Typography>
                                <Button className={classes.actionButton} onClick={() => setSignIn(true)} color="primary">
                                    Sign In
                                </Button>
                            </div>
                            <br />
                            <div className={classes.signInDiv}>
                                <Typography variant="body2">Forgot your password?</Typography>
                                <Button className={classes.actionButton} onClick={sendResetPasswordEmail} color="primary"
                                    disabled={!VALID_EMAIL.test(email)}>
                                    Reset password
                                </Button>
                            </div>
                        </div>}
                    {signIn &&
                        <div>
                            <FormControl required error={emailFormError} component="fieldset" className={clsx(classes.formControl, classes.emailMarginBottom)} >
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
                            <FormControl required error={nickNameFormError} component="fieldset" className={clsx(classes.formControl, classes.emailMarginBottom)} >
                                <FormControlLabel className={classes.textField} control={
                                    <TextField
                                        label="Nickname"
                                        className={classes.textField}
                                        required
                                        error={nickNameFormError}
                                        value={nickName}
                                        onChange={(event) => setNickname(event.target.value)}
                                        inputProps={{ maxLength: NICKNAME_MAX_LENGTH, minLength: NICKNAME_MIN_LENGTH }}
                                    />} />
                                {nickNameFormError && <FormHelperText>Nickname should be at least {NICKNAME_MIN_LENGTH} chars</FormHelperText>}
                            </FormControl>
                            <FormControl required error={newPasswordFormError} component="fieldset" className={clsx(classes.formControl, classes.newPasswordMarginBottom)} >
                                <FormControlLabel className={classes.textField} control={
                                    <TextField
                                        label="Password"
                                        className={classes.textField}
                                        required
                                        type="password"
                                        error={newPasswordFormError}
                                        value={newPassword}
                                        onChange={(event) => setNewPassword(event.target.value)}
                                    />} />
                                {newPasswordFormError && <FormHelperText>Password must be 8-chars length, 1 char up and low, 1 number and 1 special char !@#$%^&*_?</FormHelperText>}
                            </FormControl>
                            <FormControl required error={repeatNewPasswordFormError} component="fieldset" className={clsx(classes.formControl, classes.passwordMarginBottom)} >
                                <FormControlLabel className={classes.textField} control={
                                    <TextField
                                        label="Repeat password"
                                        className={classes.textField}
                                        required
                                        type="password"
                                        error={repeatNewPasswordFormError}
                                        value={repeatNewPassword}
                                        onChange={(event) => setRepeatNewPassword(event.target.value)}
                                    />} />
                                {repeatNewPasswordFormError && <FormHelperText>Passwords must be equal</FormHelperText>}
                            </FormControl>
                            <div className={classes.signInDiv}>
                                <Typography variant="body2">Already have an account?</Typography>
                                <Button className={classes.actionButton} onClick={() => setSignIn(false)} color="primary">
                                    Go to Login
                                </Button>
                            </div>
                        </div>}

                </DialogContent>
                <DialogActions>
                    <Button className={classes.actionButton} onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    {!signIn &&
                        <Button variant="contained" className={classes.actionButton} onClick={handleLogin} color="primary"
                            disabled={!VALID_EMAIL.test(email) || !VALID_PASSWORD.test(password)}>
                            Login
                        </Button>}
                    {signIn &&
                        <Button variant="contained" className={classes.actionButton} onClick={handleSignin} color="primary"
                            disabled={!VALID_EMAIL.test(email) || !VALID_PASSWORD.test(newPassword) || newPassword !== repeatNewPassword ||
                                (nickName.length < NICKNAME_MIN_LENGTH || nickName.length > NICKNAME_MAX_LENGTH)}>
                            Sign In
                        </Button>}
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default LoginDialog;