import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    AppBar, Toolbar, Typography, Button, IconButton, Tabs, Tab, Avatar, Popper, Grow, Paper,
    ClickAwayListener, MenuList, MenuItem, Divider, CircularProgress, Hidden
} from '@material-ui/core';
import { AttachMoney, AlternateEmail, SyncAlt, Face } from '@material-ui/icons';
import { Routes } from '../../libs/constants';
import { toggleLoginDialog } from '../LoginDialog/LoginDialogAction';
import { useDispatch, useSelector } from 'react-redux';
import { grey } from '@material-ui/core/colors';
import { logout } from '../../libs/firebaseRedux';
import { toggleSnackbarOpen, setSnackbarMessage, setSnackbarSeverity } from '../Snackbar/SnackbarAction';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    homeButton: {
        marginRight: theme.spacing(2),
    },
    homeButtonDiv: {
        display: 'flex'
    },
    bLetter: {
        flexGrow: 1,
        marginLeft: '-0.4em',
        marginTop: '0.1em'
    },
    AlternateEmailIcon: {
        marginTop: '0.5em'
    },
    SyncAltIcon: {
        transform: 'rotate(90deg)',
        marginTop: '0.2em',
        marginLeft: '-0.2em'
    },
    oLetter: {
        flexGrow: 1,
        marginLeft: '-0.15em',
        marginTop: '0.1em'
    },
    navArea: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center'
    },
    TabTextColorInherit: {
        height: '4.5em'
    },
    TabWrapper: {
        fontSize: 'larger',
        marginTop: '0.35em'
    },
    TabsIndicator: {
        backgroundColor: 'white'
    },
    TabsFlexContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    Tab: {
        textTransform: 'none'
    },
    login: {
        height: '4.6em'
    },
    white: {
        backgroundColor: 'white'
    },
    grey: {
        backgroundColor: grey[400]
    },
    popper: {
        marginLeft: '-3em'
    },
    circularProgress: {
        color: 'white',
    }
}));

function Header(props) {
    const { history } = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(false);
    const [openUserMenu, setOpenUserMenu] = useState(false);
    const user = useSelector(state => state.LoginDialogReducer.user);
    const imageLoaded = useSelector(state => state.HeaderReducer.loaded);
    const userButtonRef = useRef(null);

    const TabClasses = {
        textColorInherit: classes.TabTextColorInherit,
        wrapper: classes.TabWrapper
    };

    const goTo = (path) => {
        if (history.location.pathname !== path)
            history.push(path);
    };

    const changeTabIndex = (event, newValue) => {
        setTabIndex(newValue);
        switch (newValue) {
            case 0:
                goTo(Routes.HallPage.pathname);
                break;
            case 1:
                goTo(Routes.ShopPage.pathname);
                break;
            case 2:
                goTo(Routes.SettingsPage.pathname);
                break;
            case 3:
                goTo(Routes.CreditsPage.pathname);
                break;
            case 4:
                goTo(Routes.ContactUsPage.pathname);
                break;
            default:
                break;
        }
    };

    const homeButtonClick = () => {
        setTabIndex(false);
        goTo(Routes.HomePage.pathname);
    };

    const loginButtonClick = () => {
        dispatch(toggleLoginDialog(true));
    };

    const userButtonClick = () => {
        setOpenUserMenu((prevOpen) => !prevOpen);
    };

    const handleCloseUserMenu = (event) => {
        if (userButtonRef.current && userButtonRef.current.contains(event.target)) {
            return;
        }
        setOpenUserMenu(false);
    };

    function handleUserMenuListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpenUserMenu(false);
        }
    };

    const handleLogout = () => {
        logout()
            .then(() => {
                dispatch(setSnackbarMessage("User logged out. Bye bye"));
                dispatch(setSnackbarSeverity("info"));
                dispatch(toggleSnackbarOpen(true));
                setOpenUserMenu(false);
                if (history.location.pathname === Routes.AccountPage.pathname) goTo(Routes.HomePage.pathname);
            })
            .catch(error => {
                dispatch(setSnackbarMessage("Error while logging out. Retry later..."));
                dispatch(setSnackbarSeverity("error"));
                dispatch(toggleSnackbarOpen(true));
                setOpenUserMenu(false);
            });
    };

    const handleAccount = () => {
        setOpenUserMenu(false);
        setTabIndex(false);
        goTo(Routes.AccountPage.pathname);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <IconButton edge="start" className={classes.homeButton} color="inherit" aria-label="menu"
                        onClick={homeButtonClick} disableRipple disableTouchRipple>
                        <div className={classes.homeButtonDiv}>
                            <AttachMoney fontSize="large" />
                            <Typography variant="h6" className={classes.bLetter}>b</Typography>
                            <AlternateEmail fontSize="small" className={classes.AlternateEmailIcon} />
                            <SyncAlt fontSize="default" className={classes.SyncAltIcon} />
                            <Typography variant="h6" className={classes.oLetter}>o</Typography>
                        </div>
                    </IconButton>
                    <Hidden smDown>
                        <div className={classes.navArea}>
                            <Tabs value={tabIndex} onChange={changeTabIndex}
                                classes={{
                                    indicator: classes.TabsIndicator,
                                    flexContainer: classes.TabsFlexContainer
                                }}
                                centered>
                                <Tab disableRipple label="Hall"
                                    className={classes.Tab}
                                    classes={TabClasses} />
                                <Tab disableRipple label="Shop"
                                    className={classes.Tab}
                                    classes={TabClasses} />
                                <Tab disableRipple label="Settings"
                                    className={classes.Tab}
                                    classes={TabClasses} />
                                <Tab disableRipple label="Credits"
                                    className={classes.Tab}
                                    classes={TabClasses} />
                                <Tab disableRipple label="Contact us"
                                    className={classes.Tab}
                                    classes={TabClasses} />
                            </Tabs>
                        </div>
                        <div>
                            {!user &&
                                <Button disableRipple color="inherit" className={classes.login} onClick={loginButtonClick}>
                                    Login
                            </Button>}
                            {user &&
                                <div>
                                    <IconButton onClick={userButtonClick} ref={userButtonRef}>
                                        {!user.photoURL &&
                                            <Avatar className={user.emailVerified ? classes.white : classes.grey}>
                                                <Face color="primary" fontSize="large" />
                                            </Avatar>}
                                        {user.photoURL && imageLoaded && <Avatar src={user.photoURL} />}
                                        {user.photoURL && !imageLoaded && <CircularProgress className={classes.circularProgress} size={'1.65em'} />}
                                    </IconButton>
                                    <Popper open={openUserMenu} anchorEl={userButtonRef.current} role={undefined} transition disablePortal className={classes.popper}>
                                        {({ TransitionProps, placement }) => (
                                            <Grow
                                                {...TransitionProps}
                                            >
                                                <Paper>
                                                    <ClickAwayListener onClickAway={handleCloseUserMenu}>
                                                        <MenuList autoFocusItem={openUserMenu} id="menu-list-grow" onKeyDown={handleUserMenuListKeyDown}>
                                                            <MenuItem onClick={handleAccount}>My account</MenuItem>
                                                            <Divider component="li" />
                                                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                                        </MenuList>
                                                    </ClickAwayListener>
                                                </Paper>
                                            </Grow>
                                        )}
                                    </Popper>
                                </div>

                            }
                        </div>
                    </Hidden>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header;