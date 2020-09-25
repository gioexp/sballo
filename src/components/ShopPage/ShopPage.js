import React from 'react';
import { useStyles } from './ShopPageCss';

function ShopPage() {
    const classes = useStyles();

    return (
        <div className={classes.root}>CIAO SHOP</div>
    );
}

export default ShopPage;