import { makeStyles } from '@material-ui/core/styles';
import PokerTable from '../../images/poker_table.jpg';
import { green, grey, yellow, red } from '@material-ui/core/colors';

export const useStyles = makeStyles((theme) => ({
    title: {
        display: 'flex',
        justifyContent: 'center',
        width: '96%'
    },
    card: {
        width: '95%',
        marginBottom: '1%'
    },
    cardDiv: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center'
    },
    firstCardDiv: {
        marginTop: '4%'
    },
    cardActionInfoDiv: {
        display: 'inline-flex'
    },
    cardActionPlayersText: {
        marginLeft: '20%'
    },
    cardActionTimePlayText: {
        marginLeft: '10%'
    },
    cardActionSecondsDiv: {
        marginLeft: '2% !important'
    },
    cardContent: {
        backgroundImage: "url(" + PokerTable + ")",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundPositionY: '30%',
        backgroundSize: '45%',
        height: '40em'
    },
    playIcon: {
        color: green[500],
        fontSize: '3em'
    },
    pauseIcon: {
        color: grey[500],
        fontSize: '3em'
    },
    avatarDiv: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    },
    avatar: {
        width: '3em',
        height: '3em',
        backgroundColor: 'transparent'
    },
    left: {
        marginTop: '13.9%',
        marginLeft: '-43%'
    },
    topLeft: {
        marginTop: '-17%',
        marginLeft: '-22%'
    },
    top: {
        marginTop: '-4.7%'
    },
    topRight: {
        marginTop: '-4.7%',
        marginLeft: '22%'
    },
    right: {
        marginLeft: '42.4%',
        marginTop: '7.5%'
    },
    bottomRight: {
        marginLeft: '22%',
        marginTop: '7%'
    },
    bottom: {
        marginTop: '-4.65%'
    },
    bottomLeft: {
        marginLeft: '-22%',
        marginTop: '-4.65%'
    },
    avatarName: {
        backgroundColor: theme.palette.primary.main,
        paddingLeft: '0.3%',
        paddingRight: '0.3%',
        borderRadius: '30px',
        color: 'white'
    },
    avatarIcon: {
        fontSize: '3em'
    },
    avatarCircularProgress: {
        position: 'absolute',
        marginTop: '-0.1%',
    },
    red: {
        color: red[700]
    },
    yellow: {
        color: yellow[700]
    },
    grey: {
        color: grey[500]
    },
    declarationIconDiv: {
        position: 'absolute',
        marginTop: '1.7%',
        marginLeft: '2%'
    },
    declarationIconText: {
        color: 'white',
        display: 'flex',
        marginTop: '6%',
        paddingTop: '6%',
        fontWeight: 'bold',
        justifyContent: 'center',
        backgroundColor: green[500],
        width: '138%',
        borderRadius: '1em'
    },
    cardHeaderTitle: {
        fontSize: 25
    },
    cardHeaderSubheader: {
        fontSize: 16
    },
    countdownDiv: {
        height: '35em',
        position: 'absolute',
        zIndex: 1,
        width: '93.3%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    circularCountdown: {
        color: 'white'
    },
    circularLabel: {
        position: 'absolute',
        color: 'white'
    },
    playCardsDiv: {
        position: 'absolute',
        display: 'flex',
        zIndex: 1,
    },
    playCardButton: {
        width: '3em',
        height: '7em'
    },
    playCardImage: {
        width: '132%'
    },
    round0Left: {
        marginLeft: '17.5%',
        marginTop: '12.5%'
    },
    round1Left: {
        marginLeft: '14%',
        marginTop: '12.5%'
    },
    round2Left: {
        marginLeft: '11%',
        marginTop: '12.5%'
    },
    round3Left: {
        marginLeft: '7.5%',
        marginTop: '12.5%'
    },
    round4Left: {
        marginLeft: '4.3%',
        marginTop: '12.5%'
    },
    round0TopLeft: {
        marginTop: '1%',
        marginLeft: '27.5%'
    },
    round1TopLeft: {
        marginTop: '1%',
        marginLeft: '24%'
    },
    round2TopLeft: {
        marginTop: '1%',
        marginLeft: '20.5%'
    },
    round3TopLeft: {
        marginTop: '1%',
        marginLeft: '17.2%'
    },
    round4TopLeft: {
        marginTop: '1%',
        marginLeft: '14%'
    },
    round0Top: {
        marginTop: '-4%',
        marginLeft: '43.5%'
    },
    round1Top: {
        marginTop: '-4%',
        marginLeft: '41.5%'
    },
    round2Top: {
        marginTop: '-4%',
        marginLeft: '40%'
    },
    round3Top: {
        marginTop: '-4%',
        marginLeft: '38.2%'
    },
    round4Top: {
        marginTop: '-4%',
        marginLeft: '36.5%'
    },
    round0TopRight: {
        marginTop: '1.2%',
        marginLeft: '59%'
    },
    round0Right: {
        marginTop: '12.6%',
        marginLeft: '68.6%'
    },
    round0BottomRight: {
        marginTop: '23%',
        marginLeft: '59%'
    },
    round0Bottom: {
        marginTop: '28.5%',
        marginLeft: '43.5%'
    },
    round1Bottom: {
        marginTop: '28.5%',
        marginLeft: '41.5%'
    },
    round2Bottom: {
        marginTop: '28.5%',
        marginLeft: '40%'
    },
    round3Bottom: {
        marginTop: '28.5%',
        marginLeft: '38.2%'
    },
    round4Bottom: {
        marginTop: '28.5%',
        marginLeft: '36.5%'
    },
    round0BottomLeft: {
        marginTop: '23.2%',
        marginLeft: '27.5%'
    },
    round1BottomLeft: {
        marginTop: '23.2%',
        marginLeft: '24%'
    },
    round2BottomLeft: {
        marginTop: '23.2%',
        marginLeft: '20.5%'
    },
    round3BottomLeft: {
        marginTop: '23.2%',
        marginLeft: '17.2%'
    },
    round4BottomLeft: {
        marginTop: '23.2%',
        marginLeft: '14%'
    },
    declarationDiv: {
        height: '35em',
        position: 'absolute',
        width: '93.3%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    declarationCheckboxDiv: {
        marginTop: '2%'
    },
    declarationText: {
        position: 'absolute',
        color: 'white',
        marginTop: '-1%'
    },
    declarationCheckbox: {
        color: 'white'
    },
    jollyDiv: {
        position: 'absolute',
        display: 'flex',
        marginTop: '11%',
        marginLeft: '33%'
    },
    jollyImage: {
        width: '1.2em',
        display: 'flex',
        zIndex: 1,
        position: 'absolute'
    },
    jollyIcon: {
        fontSize: '3em',
        color: yellow[500],
        position: 'absolute',
        display: 'flex',
    },
    jollyTooltipDiv: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    playedCardsDiv: {
        height: '35em',
        position: 'absolute',
        width: '93.3%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playedCardImage: {
        width: '3.56%',
        margin: '0.1%'
    },
    otherDeclarationDiv: {
        display: 'inline-flex',
        color: 'white',
        width: '100%',
        justifyContent: 'center'
    },
    otherDeclarationText: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '1%'
    },
    otherDeclarationAvatar: {
        width: '3em',
        height: '3em',
        backgroundColor: 'white'
    },
    winnerNameText: {
        display: 'flex',
        position: 'absolute',
        backgroundColor: yellow[500],
        paddingLeft: '0.5%',
        paddingRight: '0.5%',
        borderRadius: '1em',
        fontWeight: 'bold',
        marginTop: '-8%'
    },
    scoreBoardDiv: {
        height: '40em',
        position: 'absolute',
        width: '93.3%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.54)',
    },
    otherPlayerCardImageDiv: {
        position: 'absolute',
        display: 'flex',
        width: '93.3%',
    },
    otherPlayerCardImage: {
        width: '100%'
    },

    otherPlayerCardPositionLeftFirstRound0: {
        marginTop: '14.2%',
        marginLeft: '23.8%',
        width: '2%'
    },
    otherPlayerCardPositionLeftFirstRound1: {
        marginTop: '14.2%',
        marginLeft: '23.2%',
        width: '2%'
    },
    otherPlayerCardPositionLeftFirstRound2: {
        marginTop: '14.2%',
        marginLeft: '22.6%',
        width: '2%'
    },
    otherPlayerCardPositionLeftFirstRound3: {
        marginTop: '14.2%',
        marginLeft: '22%',
        width: '2%'
    },
    otherPlayerCardPositionLeftFirstRound4: {
        marginTop: '14.2%',
        marginLeft: '21.4%',
        width: '2%'
    },
    otherPlayerCardPositionLeft: {
        marginTop: '14.2%',
        marginLeft: '-1.4%',
        width: '2%'
    },

    otherPlayerCardPositionTopLeftFirst: {
        marginTop: '2%',
        marginLeft: '41.2%',
        width: '2%'
    },
    otherPlayerCardPositionTopLeft: {
        marginTop: '2%',
        marginLeft: '-1.4%',
        width: '2%'
    },
    otherPlayerCardPositionTopFirst: {
        marginTop: '2%',
        marginLeft: '52.2%',
        width: '2%'
    },
    otherPlayerCardPositionTop: {
        marginTop: '2%',
        marginLeft: '-1.4%',
        width: '2%'
    },

    otherPlayerCardPositionTopRightFirst: {
        marginTop: '2%',
        marginLeft: '63.2%',
        width: '2%'
    },
    otherPlayerCardPositionTopRight: {
        marginTop: '2%',
        marginLeft: '-1.4%',
        width: '2%'
    },
    otherPlayerCardPositionRightFirst: {
        width: '2%',
        marginTop: '14.2%',
        marginLeft: '73.4%'
    },
    otherPlayerCardPositionRight: {
        marginTop: '14.2%',
        marginLeft: '-1.4%',
        width: '2%'
    },
    otherPlayerCardPositionBottomRightFirst: {
        marginTop: '25.8%',
        marginLeft: '63.2%',
        width: '2%'
    },
    otherPlayerCardPositionBottomRight: {
        marginTop: '25.8%',
        marginLeft: '-1.4%',
        width: '2%'
    },
    otherPlayerCardPositionBottomFirst: {
        marginTop: '25.8%',
        marginLeft: '52.2%',
        width: '2%'
    },
    otherPlayerCardPositionBottom: {
        marginTop: '25.8%',
        marginLeft: '-1.4%',
        width: '2%'
    },
    otherPlayerCardPositionBottomLeftFirst: {
        marginTop: '25.8%',
        marginLeft: '41.2%',
        width: '2%'
    },
    otherPlayerCardPositionBottomLeft: {
        marginTop: '25.8%',
        marginLeft: '-1.4%',
        width: '2%'
    },
}));