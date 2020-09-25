import React from 'react';
import {
    AppBar, Toolbar, Typography, IconButton
} from '@material-ui/core';
import { Facebook, Twitter } from '@material-ui/icons';
import { useStyles } from './FooterCss';

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
                            <Facebook />
                        </IconButton>
                        <IconButton edge="start" color="inherit">
                            <Twitter />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Footer;