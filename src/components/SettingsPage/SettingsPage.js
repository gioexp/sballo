import React from 'react';
import { useStyles } from './SettingsPageCss';

function SettingsPage() {
    const classes = useStyles();

    return (
        <div className={classes.root}>CIAO SETTINGS</div>
    );
}

export default SettingsPage;