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
    buttonConfirmDiv: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '2em'
    },
    buttonConfirm: {
        width: '50%'
    },
}));