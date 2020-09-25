import { makeStyles } from '@material-ui/core/styles';
import { brown, green, grey, red, yellow } from '@material-ui/core/colors';

export const useStyles = makeStyles((theme) => ({
    root: {
        width: '61em'
    },
    avatar: {
        width: '3em',
        height: '3em',
        backgroundColor: 'transparent'
    },
    pollIcon: {
        color: theme.palette.primary.main,
        fontSize: '3em'
    },
    cardHeaderTitle: {
        fontSize: 25
    },
    gridRoot: {
        flexGrow: 1,
        justifyContent: 'center'
    },
    roundPaper: {
        paddingLeft: '0.5em',
        paddingRight: '0.5em',
        paddingTop: '0.3em',
        paddingBottom: '0.5em',
        textAlign: 'center',
        color: 'white',
        backgroundColor: theme.palette.primary.main,
    },
    pointPaper: {
        padding: '0.5em',
        textAlign: 'center',
        color: 'black',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    pointItem: {
        width: '7.59%',
        height: '100%',
        marginRight: '1.4%',
    },
    pointPaperText: {
        display: 'inline-flex'
    },
    pointPaperSummaryDiv: {
        display: 'flex',
        position: 'absolute',
        marginTop: '-2.7%',
        marginLeft: '2.7%'
    },
    pointPaperRoundPointsDiv: {
        display: 'flex',
        position: 'absolute',
        marginTop: '2.9%',
        marginRight: '2.5%'
    },
    positiveResult: {
        color: green[500]
    },
    negativeResult: {
        color: red[500]
    },
    roundItem: {
        marginRight: '1.4%'
    },
    playerNameItem: {
        marginRight: '1.2em',
        width: '6em',
        marginTop: '1.6%'
    },
    scoreRow: {
        marginTop: '1.2em',
    },
    firstRank: {
        color: yellow[500]
    },
    secondRank: {
        color: grey[500]
    },
    thirdRank: {
        color: brown[500]
    },
    rankIconDiv: {
        marginTop: '1.6%',
        marginLeft: '1.8%'
    },
    closeButton: {
        position: 'absolute',
        marginTop: '-1%',
        marginLeft: '-1%'
    }
}));