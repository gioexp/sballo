import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

export const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    addButton: {
        position: 'absolute',
        right: '17%',
        top: '130%',
        borderRadius: '50%',
        height: '4.5em',
        width: '4em',
        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.main
        }
    },
    addIcon: {
        color: 'white'
    },
    gameTablesButton: {
        position: 'absolute',
        top: '255%',
        right: '17%',
        borderRadius: '50%',
        height: '4.5em',
        width: '4em',
        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.main
        },
    },
    gameTablesIcon: {
        color: 'white'
    },
    homeButton: {
        marginRight: theme.spacing(2),
    },
    homeButtonDiv: {
        display: 'flex'
    },
    bLetter: {
        flexGrow: 1,
        marginLeft: '-0.4em',
        marginTop: '0.1em'
    },
    AlternateEmailIcon: {
        marginTop: '0.5em'
    },
    SyncAltIcon: {
        transform: 'rotate(90deg)',
        marginTop: '0.2em',
        marginLeft: '-0.2em'
    },
    oLetter: {
        flexGrow: 1,
        marginLeft: '-0.15em',
        marginTop: '0.1em'
    },
    navArea: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center'
    },
    TabTextColorInherit: {
        height: '4.5em'
    },
    TabWrapper: {
        fontSize: 'larger',
        marginTop: '0.35em'
    },
    TabsIndicator: {
        backgroundColor: 'white'
    },
    TabsFlexContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    Tab: {
        textTransform: 'none'
    },
    login: {
        height: '4.5em'
    },
    white: {
        backgroundColor: 'white'
    },
    grey: {
        backgroundColor: grey[400]
    },
    popper: {
        marginLeft: '-3em'
    },
    circularProgress: {
        color: 'white',
    }
}));