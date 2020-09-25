import { makeStyles } from '@material-ui/core/styles';
import { green, grey } from '@material-ui/core/colors';

export const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '54.55em',
    },
    list: {
        width: '50%',
        marginTop: '3%'
    },
    loading: {
        marginTop: '13%'
    },
    secondaryAction: {
        display: 'inline-flex',
    },
    greyText: {
        color: 'rgba(0, 0, 0, 0.54)',
    },
    betDiv: {
        marginTop: '0.25em',
        marginRight: '3em',
    },
    playersDiv: {
        marginTop: '0.25em',
        marginRight: '3em',
    },
    infoTableIcon: {
        width: '2em',
        display: 'flex',
        justifyContent: 'center',
    },
    infoTableText: {
        color: 'rgba(0, 0, 0, 0.54)'
    },
    timePlayDiv: {
        marginTop: '0.25em',
        marginRight: '6em',
    },
    createdDiv: {
        marginTop: '0.25em'
    },
    checkIconDiv: {
        marginTop: '0.4em',
        marginRight: '3em',
    },
    checkIcon: {
        color: green[500]
    },
    noTablesDiv: {
        width: '100%',
        marginTop: '13%'
    },
    noTables: {
        display: 'flex',
        justifyContent: 'center',
        color: grey[500],
        fontWeight: 'bold'
    },
    noTablesIconDiv: {
        display: 'inline-flex',
        width: '100%',
        justifyContent: 'center'
    },
    noTablesIcon: {
        color: grey[500],
        marginLeft: '0.5%',
        marginTop: '0.2%'
    }
}));