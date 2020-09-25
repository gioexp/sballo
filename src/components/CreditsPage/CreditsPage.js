import React from 'react';
import { useStyles } from './CreditsPageCss';

function CreditsPage() {
    const classes = useStyles();

    return (
        <div className={classes.root}>CIAO CREDITS</div>
    );
}

export default CreditsPage;