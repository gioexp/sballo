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

function ShopPage() {
    const classes = useStyles();

    return (
        <div className={classes.root}>CIAO SHOP</div>
    );
}

export default ShopPage;