import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.primary.main,
    },
    actionButton: {
        textTransform: 'none'
    },
    formControl: {
        width: '100%',
    },
    marginBottom: {
        marginBottom: '1em'
    },
    textField: {
        width: '100%',
        marginRight: 0,
        marginLeft: 0
    },
    checkBoxesDiv: {
        display: 'inline-flex',
        marginTop: '1em',
    },
    checkBoxesLabel: {
        marginTop: '0.79em',
        paddingRight: '2.5em'
    },
    loadingBar: {
        width: '100%',
    }
}));