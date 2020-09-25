import React from 'react';
import { useStyles } from './HomePageCss';

function HomePage() {
    const classes = useStyles();

    return (
        <div className={classes.root}>CIAO HOME</div>
    );
}

export default HomePage;