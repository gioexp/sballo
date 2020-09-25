import React, { useState, useRef, cloneElement, useEffect } from 'react';
import {
    AppBar, Toolbar, Typography, Button, IconButton, Tabs, Tab, Avatar, Popper, Grow, Paper,
    ClickAwayListener, MenuList, MenuItem, Divider, CircularProgress, Hidden, useScrollTrigger, Tooltip
} from '@material-ui/core';
import { AttachMoney, AlternateEmail, SyncAlt, Face, Add, VideogameAsset } from '@material-ui/icons';
import { Routes } from '../../libs/constants';
import { toggleLoginDialog } from '../LoginDialog/LoginDialogAction';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../libs/firebaseRedux';
import { toggleSnackbarOpen, setSnackbarMessage, setSnackbarSeverity } from '../Snackbar/SnackbarAction';
import { useStyles } from './HeaderCss';
import { toggleCreateTableDialog } from '../CreateTableDialog/CreateTableDialogAction';
import { toggleGameTablesDialog } from '../GameTablesDialog/GameTablesDialogAction';

function ElevationScroll(props) {
    const { children } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    });

    return cloneElement(children, {
        elevation: trigger ? 4 : 4,
    });
};

function Header(props) {
    const { history } = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(false);
    const [openUserMenu, setOpenUserMenu] = useState(false);
    const user = useSelector(state => state.LoginDialogReducer.user);
    const tables = useSelector(state => state.HallPageReducer.tables);
    const imageLoaded = useSelector(state => state.HeaderReducer.loaded);
    const userButtonRef = useRef(null);

    useEffect(() => {
        // select tab in case of refresh
        switch(history.location.pathname) {
            case Routes.HallPage.pathname:
                setTabIndex(0);
                break;
            case Routes.ShopPage.pathname:
                setTabIndex(1);
                break;
            case Routes.SettingsPage.pathname:
                setTabIndex(2);
                break;
            case Routes.CreditsPage.pathname:
                setTabIndex(3);
                break;
            case Routes.ContactUsPage.pathname:
                setTabIndex(4);
                break;
            default:
                setTabIndex(false);
                break;
        }
    }, [history]);

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

    const addButtonClick = () => {
        if (user && user.emailVerified) dispatch(toggleCreateTableDialog(true));
        else {
            dispatch(setSnackbarMessage('Before create table please login or verify your email. Thanks'));
            dispatch(setSnackbarSeverity('warning'));
            dispatch(toggleSnackbarOpen(true));
        }
    };

    const openGameTables = () => {
        if (user && user.emailVerified) dispatch(toggleGameTablesDialog(true));
        else {
            dispatch(setSnackbarMessage('Before entering in game tables please login or verify your email. Thanks'));
            dispatch(setSnackbarSeverity('warning'));
            dispatch(toggleSnackbarOpen(true));
        }
    };

    return (
        <div className={classes.root}>
            <ElevationScroll {...props}>
                <AppBar color="primary">
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
                                    </div>}
                            </div>
                            {history.location.pathname === Routes.HallPage.pathname &&
                                <div>
                                    <Tooltip title="Create new table" placement="right">
                                        <Button variant="outlined" color="primary" className={classes.addButton}
                                            onClick={addButtonClick}>
                                            <Add fontSize="large" className={classes.addIcon} />
                                        </Button>
                                    </Tooltip>
                                    {tables && user && Object.entries(tables).filter(([key, table]) => table.participants.includes(user.uid)).length > 0 &&
                                        <Tooltip title="Go to game tables" placement="right">
                                            <Button variant="outlined" color="primary" className={classes.gameTablesButton}
                                                onClick={openGameTables}>
                                                <VideogameAsset fontSize="large" className={classes.gameTablesIcon} />
                                            </Button>
                                        </Tooltip>}
                                </div>}
                        </Hidden>
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
        </div>
    );
}

export default Header;