import React from 'react';
import { useStyles } from './ContactUsPageCss';

function ContactUsPage() {
    const classes = useStyles();

    return (
        <div className={classes.root}>CIAO CONTACT US</div>
    );
}

export default ContactUsPage;