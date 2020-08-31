import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import { Routes } from '../../libs/constants';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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
    const TabClasses = {
        textColorInherit: classes.TabTextColorInherit,
        wrapper: classes.TabWrapper
    };

    const [tabIndex, setTabIndex] = React.useState(false);

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

    return (
        <div className={classes.root}>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <IconButton edge="start" className={classes.homeButton} color="inherit" aria-label="menu"
                        onClick={homeButtonClick} disableRipple disableTouchRipple>
                        <div className={classes.homeButtonDiv}>
                            <AttachMoneyIcon fontSize="large" />
                            <Typography variant="h6" className={classes.bLetter}>b</Typography>
                            <AlternateEmailIcon fontSize="small" className={classes.AlternateEmailIcon} />
                            <SyncAltIcon fontSize="default" className={classes.SyncAltIcon} />
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
                        <Button disableRipple color="inherit" className={classes.login}>Login</Button>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header;