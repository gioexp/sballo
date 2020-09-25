import { makeStyles } from '@material-ui/core/styles';
import { grey, green } from '@material-ui/core/colors';

export const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '54.55em',
    },
    white: {
        backgroundColor: 'white'
    },
    grey: {
        backgroundColor: grey[400]
    },
    buttonAvatar: {
        marginLeft: '5em',
        marginTop: '5em',
        marginRight: '5em',
        width: '11em',
        height: '11em',
        padding: 0,
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    avatar: {
        width: '13em',
        height: '13em'
    },
    avatarIcon: {
        fontSize: 313
    },
    userInfo: {
        display: 'inline-flex'
    },
    details: {
        marginLeft: '4em',
        marginTop: '10em'
    },
    detailDiv: {
        display: 'inline-flex',
    },
    readOnlyDetailDiv: {
        display: 'inline-flex',
        marginBottom: '1.5em'
    },
    detailIcon: {
        marginRight: '1em'
    },
    actionButton: {
        textTransform: 'none'
    },
    missingVerificationDiv: {
        display: 'inline-flex',
        alignItems: 'center'
    },
    marginTop: {
        marginTop: '2em'
    },
    buttonEditDetail: {
        color: 'black',
        padding: 0,
        borderRadius: 0,
        marginBottom: '1em',
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    textField: {
        marginTop: '-0.2em',
        height: 24
    },
    saveButtonDiv: {
        position: 'relative',
        display: 'inline-flex'
    },
    saveButton: {
        backgroundColor: green[500],
        color: 'white',
        '&:hover': {
            backgroundColor: green[500],
        },
    },
    saveButtonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    cancelButton: {
        marginRight: '1em'
    }
}));