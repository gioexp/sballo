import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Dialog, AppBar, Toolbar, IconButton, Typography, Slide, Card, CardHeader, CardContent, CardActions,
    Tooltip, Avatar, CircularProgress, Button, Checkbox, FormControlLabel
} from '@material-ui/core';
import { Close, DeleteOutline, AttachMoney, Group, Timer, DirectionsRun, PlayCircleFilled, PauseCircleFilled, Face, FiberManualRecord } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { toggleGameTablesDialog, setGameTablesDialogCountdowns, resetGameTablesDialogCountdowns } from './GameTablesDialogAction';
import clsx from 'clsx';
import { toggleTableConfirmDialog, setTableConfirmDialogId, setTableConfirmDialogMode, setTableConfirmDialogTable } from '../TableConfirmDialog/TableConfirmDialogAction';
import PokerTable from '../../images/poker_table.jpg';
import { green, grey, yellow } from '@material-ui/core/colors';
import moment from 'moment';
import { declarePassTurnAndCleanAbsence, signalAbsence, playCardPassTurnAndCleanAbsence } from '../../libs/firebaseRedux';
import { toggleSnackbarOpen, setSnackbarMessage, setSnackbarSeverity } from '../Snackbar/SnackbarAction';
import { getJollySeed, mayIPlayThisCard, selectOneCardToPlay } from '../../libs/gameLogic';

function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { return images[item.replace('./', '')] = r(item); });
    return images;
}

const playCardImages = importAll(require.context('../../images/cards', false, /\.(png|jpe?g|svg)$/));

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
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
        marginTop: '1%'
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
        marginTop: '6.5%'
    },
    bottom: {
        marginTop: '-4.7%'
    },
    bottomLeft: {
        marginLeft: '-22%',
        marginTop: '-4.7%'
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
        marginTop: '28.3%',
        marginLeft: '43.5%'
    },
    round1Bottom: {
        marginTop: '28.3%',
        marginLeft: '41.5%'
    },
    round2Bottom: {
        marginTop: '28.3%',
        marginLeft: '40%'
    },
    round3Bottom: {
        marginTop: '28.3%',
        marginLeft: '38.2%'
    },
    round4Bottom: {
        marginTop: '28.3%',
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
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function GameTablesDialog() {
    const classes = useStyles();
    const open = useSelector(state => state.GameTablesDialogReducer.open);
    const countdowns = useSelector(state => state.GameTablesDialogReducer.countdowns);
    const tables = useSelector(state => state.HallPageReducer.tables);
    const user = useSelector(state => state.LoginDialogReducer.user);
    const userDetails = useSelector(state => state.LoginDialogReducer.userDetails);
    const dispatch = useDispatch();
    const startedTables = useRef([]);

    useEffect(() => {
        function answerIntervalFunc(table, key) {
            dispatch(setGameTablesDialogCountdowns({ key: key, started: table.clock }));
            if (moment().utc().isSameOrAfter(moment(new Date(table.clock)))) {
                // if this happens it means that someone is not playing (me or other players)
                clearInterval(startedTables.current.filter(el => el.key === key)[0].interval);
                startedTables.current = startedTables.current.filter(el => el.key !== key);
                dispatch(resetGameTablesDialogCountdowns(key));

                if (table.turnIndex === table.participants.indexOf(user.uid)) {
                    // I'm online and I didn't answer in time: 

                    if (table.declarations[table.round][table.turnIndex] === -1) {
                        // missing declaration: force the max declaration (table.shifts[table.round][0].length)
                        let playerIndex = table.participants.indexOf(user.uid);
                        let newTurnIndex = (table.turnIndex + 1) % table.players;
                        let newClock = moment().add(table.timePlay, 'seconds').utc().toString();
                        declarePassTurnAndCleanAbsence(key, table.round, playerIndex, table.shifts[table.round][0].length, newTurnIndex, newClock)
                            .catch(error => {
                                // retry until is done
                            });
                    }
                    else {
                        let card = selectOneCardToPlay(table);
                        let newTurnIndex = (table.turnIndex + 1) % table.players;
                        let newClock = moment().add(table.timePlay, 'seconds').utc().toString();
                        playCardPassTurnAndCleanAbsence(key, table.round, table.subRound, card, newTurnIndex, newClock)
                            .catch(error => {
                                // retry until is done
                            });
                    }
                }
                else {
                    // Someone is online and some other one didn't answer in time: 
                    signalAbsence(key, user.uid)
                        .then(result => {
                            if (result.committed) {
                                // I am the user that play instead of missing player
                                setTimeout(() => {
                                    if (startedTables.current.filter(el => el.key === key).length === 0) {
                                        // no one answer after 5 additional seconds of wait
                                        if (table.declarations[table.round][table.turnIndex] === -1) {
                                            let playerIndex = table.turnIndex;
                                            let newTurnIndex = (table.turnIndex + 1) % table.players;
                                            let newClock = moment().add(table.timePlay, 'seconds').utc().toString();
                                            declarePassTurnAndCleanAbsence(key, table.round, playerIndex, table.shifts[table.round][0].length, newTurnIndex, newClock)
                                                .catch(error => {
                                                    // retry until is done
                                                });
                                        }
                                        else {
                                            let card = selectOneCardToPlay(table);
                                            let newTurnIndex = (table.turnIndex + 1) % table.players;
                                            let newClock = moment().add(table.timePlay, 'seconds').utc().toString();
                                            playCardPassTurnAndCleanAbsence(key, table.round, table.subRound, card, newTurnIndex, newClock)
                                                .catch(error => {
                                                    // retry until is done
                                                });
                                        }
                                    }
                                }, 5000);
                            }
                        })
                        .catch(error => {
                            dispatch(setSnackbarMessage('Error while declating absence. Please, contact Sballo signaling your problem.'));
                            dispatch(setSnackbarSeverity('error'));
                            dispatch(toggleSnackbarOpen(true));
                        });
                }
            }
        }

        function intervalFunc(table, key) {
            dispatch(setGameTablesDialogCountdowns({ key: key, started: table.started }));
            if (moment().utc().isSameOrAfter(moment(new Date(table.started)))) {
                clearInterval(startedTables.current.filter(el => el.key === key)[0].interval);
                startedTables.current = startedTables.current.filter(el => el.key !== key);
                dispatch(resetGameTablesDialogCountdowns(key));

                // first time pulse from here clock countdown
                let newObj = {
                    key: key, interval: setInterval(answerIntervalFunc, 1000, table, key)
                };
                startedTables.current.push(newObj);
            }
        }

        if (tables && user) {
            let startedArray = Object.entries(tables).filter(([key, table]) => table.participants.includes(user.uid)).map(([key, table]) => {
                return { key: key, table: table }
            });
            for (let i = 0; i < startedArray.length; i++) {
                if (startedArray[i].table.started && !moment().utc().isSameOrAfter(moment(new Date(startedArray[i].table.started)))) {
                    if (!startedTables.current.map(el => el.key).includes(startedArray[i].key)) {
                        let newObj = {
                            key: startedArray[i].key, interval: setInterval(intervalFunc, 1000, startedArray[i].table, startedArray[i].key)
                        };
                        startedTables.current.push(newObj);
                    }
                }

                if (startedArray[i].table.clock && moment().utc().isSameOrAfter(moment(new Date(startedArray[i].table.started)))
                    && !moment().utc().isSameOrAfter(moment(new Date(startedArray[i].table.clock)))) {
                    if (!startedTables.current.map(el => el.key).includes(startedArray[i].key)) {
                        let newObj = {
                            key: startedArray[i].key, interval: setInterval(answerIntervalFunc, 1000, startedArray[i].table, startedArray[i].key)
                        };
                        startedTables.current.push(newObj);
                    }
                }
            }
        }
    }, [tables, user, dispatch]);

    const handleClose = () => {
        dispatch(toggleGameTablesDialog(false));
    };

    const handleTableDelete = (key, table) => {
        dispatch(setTableConfirmDialogId(key));
        dispatch(setTableConfirmDialogTable(table));
        dispatch(setTableConfirmDialogMode('delete'));
        dispatch(toggleTableConfirmDialog(true));
    };

    const handleTableLeave = (key, table) => {
        dispatch(setTableConfirmDialogId(key));
        dispatch(setTableConfirmDialogTable(table));
        dispatch(setTableConfirmDialogMode('leave'));
        dispatch(toggleTableConfirmDialog(true));
    };

    const cardAction = (key, table) => {
        if (table.authorUid === user.uid) {
            return (
                <Tooltip title="Delete table" placement="bottom">
                    <span>
                        <IconButton onClick={() => handleTableDelete(key, table)} disabled={table.started !== undefined}>
                            <DeleteOutline />
                        </IconButton>
                    </span>
                </Tooltip>
            );
        }
        if (table.authorUid !== user.uid) {
            return (
                <Tooltip title="Leave table" placement="bottom">
                    <span>
                        <IconButton onClick={() => handleTableLeave(key, table)} disabled={table.started !== undefined}>
                            <DirectionsRun />
                        </IconButton>
                    </span>
                </Tooltip>
            );
        }
    };

    const getUserDetailsByUid = (uid) => {
        let userDet = Object.values(userDetails).filter(usr => usr.uid === uid);
        if (userDet.length === 0) return { displayName: 'user' };
        else return userDet[0];
    };

    const selectCard = (key, table, card) => {
        if (table.declarations[table.round].includes(-1)) {
            dispatch(setSnackbarMessage('Please, wait until everybody declaring how many rounds will win. Thanks'));
            dispatch(setSnackbarSeverity('warning'));
            dispatch(toggleSnackbarOpen(true));
        }
        else if (table.turnIndex !== table.participants.indexOf(user.uid)) {
            dispatch(setSnackbarMessage('Please, wait until is your turn. Thanks'));
            dispatch(setSnackbarSeverity('warning'));
            dispatch(toggleSnackbarOpen(true));
        }
        else {
            if (mayIPlayThisCard(table, card)) {
                let filter = startedTables.current.filter(el => el.key === key);
                if (filter.length > 0) {
                    clearInterval(filter[0].interval);
                    startedTables.current = startedTables.current.filter(el => el.key !== key);
                    dispatch(resetGameTablesDialogCountdowns(key));
                }

                let newTurnIndex = (table.turnIndex + 1) % table.players;
                let newClock = moment().add(table.timePlay, 'seconds').utc().toString();
                playCardPassTurnAndCleanAbsence(key, table.round, table.subRound, card, newTurnIndex, newClock)
                    .catch(error => {
                        dispatch(setSnackbarMessage('Error while playing the card. Try to select card again. Thanks'));
                        dispatch(setSnackbarSeverity('error'));
                        dispatch(toggleSnackbarOpen(true));
                    });
            }
            else {
                dispatch(setSnackbarMessage('You cannot play this card. Please, try to select a card of the same seed of the first card played.'));
                dispatch(setSnackbarSeverity('warning'));
                dispatch(toggleSnackbarOpen(true));
            }
        }
    };

    const handleDeclarationChange = (declaration, key, table) => {
        let filter = startedTables.current.filter(el => el.key === key);
        if (filter.length > 0) {
            clearInterval(filter[0].interval);
            startedTables.current = startedTables.current.filter(el => el.key !== key);
            dispatch(resetGameTablesDialogCountdowns(key));
        }

        let playerIndex = table.participants.indexOf(user.uid);
        let newTurnIndex = (table.turnIndex + 1) % table.players;
        let newClock = moment().add(table.timePlay, 'seconds').utc().toString();
        declarePassTurnAndCleanAbsence(key, table.round, playerIndex, declaration, newTurnIndex, newClock)
            .catch(error => {
                dispatch(setSnackbarMessage('Error while passing the turn. Try to select winning rounds again. Thanks'));
                dispatch(setSnackbarSeverity('error'));
                dispatch(toggleSnackbarOpen(true));
            });
    };

    const getAvailableDeclarations = (table) => {
        let allDeclarations = [...Array(table.shifts[table.round][0].length + 1).keys()];
        let declarationDone = table.declarations[table.round].filter(el => el !== -1).reduce((a, b) => a + b, 0);

        if (declarationDone >= (allDeclarations.length - 1)) return allDeclarations;
        else {
            if (table.turnIndex === table.round) {
                // last player to declare must fill all the missing declaration (every round must have at least a number of declaration equal to number of cards)
                return allDeclarations.filter(x => ![...Array(allDeclarations.length - declarationDone - 1).keys()].includes(x));
            }
            else return allDeclarations;
        }
    };

    const avatarPosition = (index) => {
        switch (index) {
            case 0:
                return classes.left;
            case 1:
                return classes.topLeft;
            case 2:
                return classes.top;
            case 3:
                return classes.topRight;
            case 4:
                return classes.right;
            case 5:
                return classes.bottomRight;
            case 6:
                return classes.bottom;
            case 7:
                return classes.bottomLeft;
            default:
                return null;
        }
    };

    const cardPosition = (round, index) => {
        switch (index) {
            case 0:
                return leftCardPositionOnRound(round);
            case 1:
                return topLeftCardPositionOnRound(round);
            case 2:
                return topCardPositionOnRound(round);
            case 3:
                return classes.round0TopRight;
            case 4:
                return classes.round0Right;
            case 5:
                return classes.round0BottomRight;
            case 6:
                return bottomCardPositionOnRound(round);
            case 7:
                return bottomLeftCardPositionOnRound(round);
            default:
                return null;
        }
    };

    const leftCardPositionOnRound = (round) => {
        switch (round) {
            case 0:
            case 8:
                return classes.round0Left;
            case 1:
            case 7:
                return classes.round1Left;
            case 2:
            case 6:
                return classes.round2Left;
            case 3:
            case 5:
                return classes.round3Left;
            case 4:
                return classes.round4Left;
            default:
                return null;
        }
    };

    const topLeftCardPositionOnRound = (round) => {
        switch (round) {
            case 0:
            case 8:
                return classes.round0TopLeft;
            case 1:
            case 7:
                return classes.round1TopLeft;
            case 2:
            case 6:
                return classes.round2TopLeft;
            case 3:
            case 5:
                return classes.round3TopLeft;
            case 4:
                return classes.round4TopLeft;
            default:
                return null;
        }
    };

    const topCardPositionOnRound = (round) => {
        switch (round) {
            case 0:
            case 8:
                return classes.round0Top;
            case 1:
            case 7:
                return classes.round1Top;
            case 2:
            case 6:
                return classes.round2Top;
            case 3:
            case 5:
                return classes.round3Top;
            case 4:
                return classes.round4Top;
            default:
                return null;
        }
    };

    const bottomCardPositionOnRound = (round) => {
        switch (round) {
            case 0:
            case 8:
                return classes.round0Bottom;
            case 1:
            case 7:
                return classes.round1Bottom;
            case 2:
            case 6:
                return classes.round2Bottom;
            case 3:
            case 5:
                return classes.round3Bottom;
            case 4:
                return classes.round4Bottom;
            default:
                return null;
        }
    };

    const bottomLeftCardPositionOnRound = (round) => {
        switch (round) {
            case 0:
            case 8:
                return classes.round0BottomLeft;
            case 1:
            case 7:
                return classes.round1BottomLeft;
            case 2:
            case 6:
                return classes.round2BottomLeft;
            case 3:
            case 5:
                return classes.round3BottomLeft;
            case 4:
                return classes.round4BottomLeft;
            default:
                return null;
        }
    };

    return (
        <div>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                keepMounted>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <Close />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Game Tables
                        </Typography>
                    </Toolbar>
                </AppBar>
                {tables && user && Object.entries(tables).filter(([key, table]) => table.participants.includes(user.uid)).map(([key, table], i) => (

                    <div className={clsx(classes.cardDiv, i === 0 ? classes.firstCardDiv : null)} key={key}>
                        <Card className={classes.card}>
                            <CardHeader
                                avatar={
                                    <Tooltip title={"Table status: " + (table.started ? "started" : "waiting")} placement="bottom">
                                        <Avatar className={classes.avatar}>
                                            {table.started ? <PlayCircleFilled className={classes.playIcon} fontSize="large" /> : <PauseCircleFilled className={classes.pauseIcon} fontSize="large" />}
                                        </Avatar>
                                    </Tooltip>
                                }
                                action={cardAction(key, table)}
                                title={table.name}
                                subheader={'made by: ' + table.author}
                                classes={{
                                    title: classes.cardHeaderTitle,
                                    subheader: classes.cardHeaderSubheader
                                }}
                            />
                            <CardContent className={classes.cardContent}>
                                {table.started && !moment().utc().isSameOrAfter(moment(new Date(table.started))) &&
                                    <div className={classes.countdownDiv}>
                                        {/* INITIAL COUNDOWN */}
                                        <CircularProgress className={classes.circularCountdown} variant="static" size='4em' value={countdowns.filter(el => el.key === key).length > 0 ?
                                            100 - (countdowns.filter(el => el.key === key)[0].value * 10 / 6) : 0} />
                                        <Typography className={classes.circularLabel} variant="body1" >{countdowns.filter(el => el.key === key).length > 0 ?
                                            countdowns.filter(el => el.key === key)[0].value : 0}s
                                        </Typography>
                                    </div>}
                                {!table.started && !moment().utc().isSameOrAfter(moment(new Date(table.started))) &&
                                    <div className={classes.countdownDiv}>
                                        {/* WAITING MESSAGE */}
                                        <Typography className={classes.circularLabel} variant="body1" >Waiting for other {table.players - table.participants.length} participant(s)...</Typography>
                                    </div>}
                                {table.started && moment().utc().isSameOrAfter(moment(new Date(table.started))) &&
                                    <div>
                                        <div className={clsx(classes.playCardsDiv, cardPosition(table.round, table.participants.indexOf(user.uid)))}>
                                            {/* CARDS */}
                                            {table.shifts[table.round][table.participants.indexOf(user.uid)].map((card, j) => (
                                                <Button key={j} className={classes.playCardButton} onClick={() => selectCard(key, table, card)} disableFocusRipple disableRipple
                                                    disabled={table.playedCards[table.round].flat().includes(card)}>
                                                    {table.playedCards[table.round].flat().includes(card) ?
                                                        <img src={playCardImages['Red_back.jpg']} alt="card" className={classes.playCardImage} /> :
                                                        <img src={playCardImages[card + '.jpg']} alt="card" className={classes.playCardImage} />}
                                                </Button>
                                            ))}
                                        </div>
                                        <div className={classes.jollyDiv}>
                                            {/* JOLLY */}
                                            <Tooltip title={"Jolly seed: " + getJollySeed(table.jolly[table.round])} placement="bottom">
                                                <div className={classes.jollyTooltipDiv}>
                                                    <FiberManualRecord fontSize='inherit' className={classes.jollyIcon} />
                                                    <img src={playCardImages[getJollySeed(table.jolly[table.round]) + '.png']} className={classes.jollyImage} alt="jolly-seed" />
                                                </div>
                                            </Tooltip>
                                        </div>
                                    </div>
                                }
                                {table.started && moment().utc().isSameOrAfter(moment(new Date(table.started))) && table.turnIndex === table.participants.indexOf(user.uid) &&
                                    table.declarations[table.round][table.turnIndex] === -1 &&
                                    <div className={classes.declarationDiv}>
                                        {/* DECLARATIONS */}
                                        <Typography className={classes.declarationText} variant="body1" >How many rounds you will win?</Typography>
                                        <div className={classes.declarationCheckboxDiv}>
                                            {getAvailableDeclarations(table).map((index) => (
                                                <FormControlLabel
                                                    className={classes.declarationCheckbox}
                                                    key={index}
                                                    control={
                                                        <Checkbox
                                                            checked={table.declarations[table.round][table.participants.indexOf(user.uid)] === index}
                                                            onChange={(event) => handleDeclarationChange(Number(event.target.name), key, table)}
                                                            name={String(index)}
                                                            color="primary"
                                                            className={classes.declarationCheckbox}
                                                        />}
                                                    label={index}
                                                />
                                            ))}
                                        </div>
                                    </div>}
                                {table.started && moment().utc().isSameOrAfter(moment(new Date(table.started))) && !table.declarations[table.round].includes(-1) &&
                                    <div className={classes.playedCardsDiv}>
                                        {/* PLAYED CARDS */}
                                        {table.playedCards[table.round][table.subRound].filter(el => el !== -1).map((card) => (
                                            <img key={card} src={playCardImages[card + '.jpg']} alt="card"
                                                className={classes.playedCardImage} />
                                        ))}
                                    </div>
                                }
                                {/* PLAYERS AVATAR */}
                                <div>
                                    {table.participants.map((uid, i) => (
                                        <div key={i} className={clsx(classes.avatarDiv, avatarPosition(i))}>
                                            {(!userDetails || !getUserDetailsByUid(uid).photoURL) &&
                                                <Avatar key={i} className={classes.avatar}>
                                                    <Face color="primary" className={classes.avatarIcon} />
                                                </Avatar>}
                                            {userDetails && getUserDetailsByUid(uid).photoURL &&
                                                <Avatar src={getUserDetailsByUid(uid).photoURL} className={classes.avatar} />
                                            }
                                            {userDetails && <Typography className={classes.avatarName}>{getUserDetailsByUid(uid).displayName}</Typography>}
                                            {table.started && moment().utc().isSameOrAfter(moment(new Date(table.started))) && table.turnIndex === table.participants.indexOf(uid) &&
                                                <CircularProgress variant="static" size='4em' className={classes.avatarCircularProgress} value={countdowns.filter(el => el.key === key).length > 0 ?
                                                    100 - (countdowns.filter(el => el.key === key)[0].value * 100 / table.timePlay) : 0} />}
                                            {table.started && table.declarations[table.round][table.participants.indexOf(uid)] !== -1 &&
                                                <div className={classes.declarationIconDiv}>
                                                    <Typography variant="body1" className={classes.declarationIconText}>
                                                        {table.points[table.round][table.participants.indexOf(uid)]}/{table.declarations[table.round][table.participants.indexOf(uid)]}
                                                    </Typography>
                                                </div>}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardActions>
                                <Tooltip title="Bet" placement="bottom">
                                    <div className={classes.cardActionInfoDiv}>
                                        <AttachMoney fontSize="small" />
                                        <Typography variant="body1" align="center">
                                            {table.bet}
                                        </Typography>
                                    </div>
                                </Tooltip>
                                <Tooltip title="Players" placement="bottom">
                                    <div className={clsx(classes.cardActionInfoDiv, classes.cardActionSecondsDiv)}>
                                        <Group fontSize="small" />
                                        <Typography variant="body1" align="center" className={classes.cardActionPlayersText}>
                                            {table.players}
                                        </Typography>
                                    </div>
                                </Tooltip>
                                <Tooltip title="Play time" placement="bottom">
                                    <div className={clsx(classes.cardActionInfoDiv, classes.cardActionSecondsDiv)}>
                                        <Timer fontSize="small" />
                                        <Typography variant="body1" align="center" className={classes.cardActionTimePlayText}>
                                            {table.timePlay + '\'\''}
                                        </Typography>
                                    </div>
                                </Tooltip>
                            </CardActions>
                        </Card>
                    </div>
                ))}
            </Dialog>
        </div >
    );
}

export default GameTablesDialog;