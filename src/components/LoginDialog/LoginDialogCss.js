import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.primary.main,
    },
    actionButton: {
        textTransform: 'none'
    },
    loadingBar: {
        width: '100%',
    },
    formControl: {
        width: '100%',
    },
    emailMarginBottom: {
        marginBottom: '1em'
    },
    passwordMarginBottom: {
        marginBottom: '2em'
    },
    textField: {
        width: '100%',
        marginRight: 0,
        marginLeft: 0
    },
    signInDiv: {
        display: 'inline-flex',
        alignItems: 'center'
    },
    newPasswordMarginBottom: {
        marginBottom: '1em'
    }
}));