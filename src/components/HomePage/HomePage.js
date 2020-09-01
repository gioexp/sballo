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

function HomePage() {
    const classes = useStyles();

    return (
        <div className={classes.root}>CIAO HOME</div>
    );
}

export default HomePage;