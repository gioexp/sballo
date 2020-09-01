import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    AppBar, Toolbar, Typography, IconButton
} from '@material-ui/core';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';

const useStyles = makeStyles((theme) => ({
    centered: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
    },
    infoText: {
        fontStyle: 'oblique',
        fontSize: '0.9em'
    },
    followDiv: {
        position: 'absolute',
        right: '-40em',
        display: 'inline-flex',
    },
    followText: {
        fontStyle: 'oblique',
        fontSize: '0.9em',
        marginTop: '0.95em',
        marginRight: '1em'
    },
    emoji: {
        fontStyle: 'normal',
    }
}));

function Footer() {
    const classes = useStyles();

    return (
        <div>
            <AppBar position="static" color="primary" className={classes.centered}>
                <Toolbar>
                    <Typography variant="body1" color="inherit" align="center" className={classes.infoText}>
                        Sballo v0.1.0 &copy; 2020 - Powered by: gio<span role="img" aria-label="cow" className={classes.emoji}>🐮</span>exp
                    </Typography>
                    <div className={classes.followDiv}>
                        <Typography variant="body1" color="inherit" align="center" className={classes.followText}>
                            Follow us:
                        </Typography>
                        <IconButton edge="start" color="inherit">
                            <FacebookIcon />
                        </IconButton>
                        <IconButton edge="start" color="inherit">
                            <TwitterIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Footer;