import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '50.55em',
    }
}));

function SettingsPage() {
    const classes = useStyles();

    return (
        <div className={classes.root}>CIAO SETTINGS</div>
    );
}

export default SettingsPage;