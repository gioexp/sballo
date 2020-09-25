import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    centered: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
    },
    infoText: {
        fontStyle: 'oblique',
        fontSize: '0.9em'
    },
    followDiv: {
        position: 'absolute',
        right: '-40em',
        display: 'inline-flex',
    },
    followText: {
        fontStyle: 'oblique',
        fontSize: '0.9em',
        marginTop: '0.95em',
        marginRight: '1em'
    },
    emoji: {
        fontStyle: 'normal',
    }
}));