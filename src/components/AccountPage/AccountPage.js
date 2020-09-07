import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { grey, green } from '@material-ui/core/colors';
import { IconButton, Avatar, Typography, Tooltip, Button, TextField, CircularProgress } from '@material-ui/core';
import { Face, Email, CheckCircle, AccessTime, Error } from '@material-ui/icons';
import clsx from 'clsx';
import moment from 'moment';
import { sendEmailVerification, updateUserEmail, updateUserProfile, uploadUserImage } from '../../libs/firebaseRedux';
import { toggleSnackbarOpen, setSnackbarMessage, setSnackbarSeverity } from '../Snackbar/SnackbarAction';
import { VALID_EMAIL, NICKNAME_MIN_LENGTH, NICKNAME_MAX_LENGTH } from '../../libs/constants';
import { toggleUserImageLoaded } from '../Header/HeaderAction';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '50.55em',
    },
    white: {
        backgroundColor: 'white'
    },
    grey: {
        backgroundColor: grey[400]
    },
    buttonAvatar: {
        marginLeft: '5em',
        marginTop: '5em',
        marginRight: '5em',
        width: '11em',
        height: '11em',
        padding: 0,
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    avatar: {
        width: '13em',
        height: '13em'
    },
    avatarIcon: {
        fontSize: 300
    },
    userInfo: {
        display: 'inline-flex'
    },
    details: {
        marginLeft: '4em',
        marginTop: '10em'
    },
    detailDiv: {
        display: 'inline-flex',
    },
    readOnlyDetailDiv: {
        display: 'inline-flex',
        marginBottom: '1.5em'
    },
    detailIcon: {
        marginRight: '1em'
    },
    actionButton: {
        textTransform: 'none'
    },
    missingVerificationDiv: {
        display: 'inline-flex',
        alignItems: 'center'
    },
    marginTop: {
        marginTop: '2em'
    },
    buttonEditDetail: {
        color: 'black',
        padding: 0,
        borderRadius: 0,
        marginBottom: '1em',
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    textField: {
        marginTop: '-0.2em',
        height: 24
    },
    saveButtonDiv: {
        // margin: theme.spacing(1),
        position: 'relative',
        display: 'inline-flex'
    },
    saveButton: {
        backgroundColor: green[500],
        color: 'white',
        '&:hover': {
            backgroundColor: green[500],
        },
    },
    saveButtonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    cancelButton: {
        marginRight: '1em'
    }
}));

function AccountPage() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = useSelector(state => state.LoginDialogReducer.user);
    const [disableButtonSendEmail, setDisableButtonSendEmail] = useState(false);
    const [editEmail, setEditEmail] = useState(false);
    const [tempEmail, setTempEmail] = useState('');
    const [editNickname, setEditNickname] = useState(false);
    const [tempNickname, setTempNickname] = useState('');
    const [imageLoaded, setImageLoaded] = useState(true);
    const [loading, setLoading] = useState(false);

    const uploadFile = (event) => {
        if (event.target.files[0]) {
            setImageLoaded(false);
            dispatch(toggleUserImageLoaded(false));
            const fileReader = new FileReader();
            fileReader.readAsDataURL(event.target.files[0]);
            fileReader.onload = (e) => {
                uploadUserImage(user, e.target.result)
                    .then(result => {
                        result.ref.getDownloadURL()
                            .then(url => {
                                updateUserProfile(user, user.displayName, url)
                                    .then(() => {
                                        dispatch(setSnackbarMessage('Image uploaded!'));
                                        dispatch(setSnackbarSeverity('success'));
                                        dispatch(toggleSnackbarOpen(true));
                                        setImageLoaded(true);
                                        dispatch(toggleUserImageLoaded(true));
                                    })
                                    .catch(error => {
                                        dispatch(setSnackbarMessage('Error while updating image. Retry later...'));
                                        dispatch(setSnackbarSeverity('error'));
                                        dispatch(toggleSnackbarOpen(true));
                                    })
                            })
                            .catch(error => {
                                dispatch(setSnackbarMessage('Error while getting user image URL. Retry later...'));
                                dispatch(setSnackbarSeverity('error'));
                                dispatch(toggleSnackbarOpen(true));
                            })
                    })
                    .catch(error => {
                        dispatch(setSnackbarMessage('Error while uploading user image. Retry later...'));
                        dispatch(setSnackbarSeverity('error'));
                        dispatch(toggleSnackbarOpen(true));
                    })
            };
        }
    };

    const sendVerificationEmail = () => {
        sendEmailVerification(user)
            .then(() => {
                dispatch(setSnackbarMessage('Verification email sent! Check your inbox and click on link to verify your account. Thanks'));
                dispatch(setSnackbarSeverity('success'));
                dispatch(toggleSnackbarOpen(true));
                setDisableButtonSendEmail(true);
            })
            .catch(error => {
                dispatch(setSnackbarMessage('Error while sending verification email. Retry later...'));
                dispatch(setSnackbarSeverity('error'));
                dispatch(toggleSnackbarOpen(true));
            });
    };

    const handleEditEmail = () => {
        if (user.emailVerified) {
            if (!editEmail) {
                setTempEmail(user.email);
                setEditEmail(true);
            }
        }
        else {
            dispatch(setSnackbarMessage('Before edit email please verify it. Thanks'));
            dispatch(setSnackbarSeverity('warning'));
            dispatch(toggleSnackbarOpen(true));
        }
    };

    const hadleEditNickname = () => {
        if (user.emailVerified) {
            if (!editNickname) {
                setTempNickname(user.displayName);
                setEditNickname(true);
            }
        }
        else {
            dispatch(setSnackbarMessage('Before edit nickname please verify your email. Thanks'));
            dispatch(setSnackbarSeverity('warning'));
            dispatch(toggleSnackbarOpen(true));
        }
    };

    const cancelEdit = () => {
        setEditEmail(false);
        setEditNickname(false);
    };

    const updateUserDetails = () => {
        setLoading(true);
        updateUserEmail(user, tempEmail.length > 0 ? tempEmail : user.email)
            .then(() => {
                updateUserProfile(user, tempNickname.length > 0 ? tempNickname : user.displayName)
                    .then(() => {
                        dispatch(setSnackbarMessage('User details updated!'));
                        dispatch(setSnackbarSeverity('success'));
                        dispatch(toggleSnackbarOpen(true));
                        setEditEmail(false);
                        setEditNickname(false);
                        setLoading(false);
                    })
                    .catch(error => {
                        dispatch(setSnackbarMessage('Error while updating nickname. Retry later...'));
                        dispatch(setSnackbarSeverity('error'));
                        dispatch(toggleSnackbarOpen(true));
                        setEditEmail(false);
                        setEditNickname(false);
                        setLoading(false);
                    });
            })
            .catch(error => {
                dispatch(setSnackbarMessage('Error while updating email. Retry later...'));
                dispatch(setSnackbarSeverity('error'));
                dispatch(toggleSnackbarOpen(true));
                setEditEmail(false);
                setEditNickname(false);
                setLoading(false);
            });
    };

    return (
        <div className={classes.root}>
            {user &&
                <div className={classes.userInfo}>
                    <Tooltip title="Change avatar image" placement="bottom">
                        <IconButton className={classes.buttonAvatar} disableFocusRipple disableRipple component="label" disabled={!imageLoaded}>
                            {!user.photoURL &&
                                <Avatar className={clsx(user.emailVerified ? classes.white : classes.grey, classes.avatar)}>
                                    <Face color="primary" className={classes.avatarIcon} />
                                </Avatar>}
                            {user.photoURL && imageLoaded && <Avatar className={classes.avatar} src={user.photoURL} />}
                            {user.photoURL && !imageLoaded && <CircularProgress />}
                            <input
                                type="file"
                                style={{ display: "none" }}
                                onChange={uploadFile}
                                accept="image/*"
                            />
                        </IconButton>
                    </Tooltip>
                    <div className={classes.details}>
                        <Tooltip title="Edit Email" placement="right">
                            <IconButton onClick={handleEditEmail} className={classes.buttonEditDetail} disableFocusRipple disableRipple>
                                <div className={classes.detailDiv}>
                                    <Email color="primary" className={classes.detailIcon} />
                                    {!editEmail && <Typography>{user.email}</Typography>}
                                    {editEmail &&
                                        <TextField
                                            className={classes.textField}
                                            error={!VALID_EMAIL.test(tempEmail)}
                                            value={tempEmail}
                                            onChange={(event) => setTempEmail(event.target.value)}
                                        />}
                                </div>
                            </IconButton>
                        </Tooltip>
                        <br />
                        <Tooltip title="Edit Nickname" placement="right">
                            <IconButton onClick={hadleEditNickname} className={classes.buttonEditDetail} disableFocusRipple disableRipple>
                                <div className={classes.detailDiv}>
                                    <Face color="primary" className={classes.detailIcon} />
                                    {!editNickname && <Typography>{user.displayName}</Typography>}
                                    {editNickname &&
                                        <TextField
                                            className={classes.textField}
                                            error={tempNickname.length < NICKNAME_MIN_LENGTH || tempNickname.length > NICKNAME_MAX_LENGTH}
                                            value={tempNickname}
                                            onChange={(event) => setTempNickname(event.target.value)}
                                            inputProps={{ maxLength: NICKNAME_MAX_LENGTH, minLength: NICKNAME_MIN_LENGTH }}
                                        />}
                                </div>
                            </IconButton>
                        </Tooltip>
                        <br />
                        <Tooltip title="Account creation" placement="right">
                            <div className={classes.readOnlyDetailDiv}>
                                <CheckCircle color="primary" className={classes.detailIcon} />
                                <Typography>{moment(user.metadata.creationTime).format('LLLL')}</Typography>
                            </div>
                        </Tooltip>
                        <br />
                        <Tooltip title="Last login" placement="right">
                            <div className={classes.readOnlyDetailDiv}>
                                <AccessTime color="primary" className={classes.detailIcon} />
                                <Typography>{moment(user.metadata.lastSignInTime).format('LLLL')}</Typography>
                            </div>
                        </Tooltip>
                        <br />
                        {!user.emailVerified &&
                            <div>
                                <div className={clsx(classes.missingVerificationDiv, classes.marginTop)}>
                                    <Error color="secondary" className={classes.detailIcon} />
                                    <Typography variant="body2">You didn't verify you email. Please, go to email and click on link.</Typography>
                                </div>
                                <br />
                                <div className={classes.missingVerificationDiv}>
                                    <Typography variant="body2">Lost your verification email?</Typography>
                                    <Button className={classes.actionButton} onClick={sendVerificationEmail} color="primary"
                                        disabled={disableButtonSendEmail}>
                                        Send verification email
                                    </Button>
                                </div>
                            </div>
                        }
                        {(editEmail || editNickname) &&
                            <div>
                                <Button className={clsx(classes.actionButton, classes.cancelButton)} onClick={cancelEdit} color="primary">
                                    Cancel
                                </Button>
                                <div className={classes.saveButtonDiv}>
                                    <Button className={clsx(classes.actionButton, classes.saveButton)} onClick={updateUserDetails} variant="contained"
                                        disabled={loading || ((tempEmail === user.email || !VALID_EMAIL.test(tempEmail)) && (tempNickname === user.displayName || (tempNickname.length < NICKNAME_MIN_LENGTH || tempNickname.length > NICKNAME_MAX_LENGTH)))}>
                                        Save
                                    </Button>
                                    {loading && <CircularProgress size={'1.5em'} className={classes.saveButtonProgress} />}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    );
}

export default AccountPage;