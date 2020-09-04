import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button, IconButton, Tabs, Tab } from '@material-ui/core';
import { AttachMoney, AlternateEmail, SyncAlt } from '@material-ui/icons';
import { Routes } from '../../libs/constants';
import { toggleLoginDialog } from '../LoginDialog/LoginDialogAction';
import { useDispatch } from 'react-redux';

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
    }
}));

function Header(props) {
    const { history } = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const TabClasses = {
        textColorInherit: classes.TabTextColorInherit,
        wrapper: classes.TabWrapper
    };

    const [tabIndex, setTabIndex] = useState(false);

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
                        <Button disableRipple color="inherit" className={classes.login} onClick={loginButtonClick}>
                            Login
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header;