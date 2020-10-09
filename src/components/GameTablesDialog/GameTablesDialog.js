import React, { useEffect, useRef, cloneElement } from 'react';
import {
    Dialog, AppBar, Toolbar, IconButton, Typography, Slide, Card, CardHeader, CardContent, CardActions,
    Tooltip, Avatar, CircularProgress, Button, Checkbox, FormControlLabel, useScrollTrigger, Zoom
} from '@material-ui/core';
import { Close, DeleteOutline, AttachMoney, Group, Timer, DirectionsRun, PlayCircleFilled, PauseCircleFilled, Face, FiberManualRecord, Poll, CheckCircle } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { toggleGameTablesDialog, setGameTablesDialogCountdowns, resetGameTablesDialogCountdowns } from './GameTablesDialogAction';
import clsx from 'clsx';
import { toggleTableConfirmDialog, setTableConfirmDialogId, setTableConfirmDialogMode, setTableConfirmDialogTable } from '../TableConfirmDialog/TableConfirmDialogAction';
import moment from 'moment';
import { declarePassTurnAndCleanAbsence, signalAbsence, playCardAndCleanAbsence, passTurn, openScoreBoard, moveTableToHistory, deleteFirebase } from '../../libs/firebaseRedux';
import { toggleSnackbarOpen, setSnackbarMessage, setSnackbarSeverity } from '../Snackbar/SnackbarAction';
import { getJollySeed, mayIPlayThisCard, selectOneCardToPlay, determinateSubTurnWinnerIndex } from '../../libs/gameLogic';
import { MAX_CALL_RETRY, SCOREBOARD_TIME } from '../../libs/constants';
import Scoreboard from '../Scoreboard/Scoreboard';
import { toggleScoreboard } from '../Scoreboard/ScoreboardAction';
import { useStyles } from './GameTablesDialogCss';
import { retryPromise } from '../../libs/promise';

function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { return images[item.replace('./', '')] = r(item); });
    return images;
}

const playCardImages = importAll(require.context('../../images/cards', false, /\.(png|jpe?g|svg)$/));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ElevationScroll(props) {
    const { children } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    });

    return cloneElement(children, {
        elevation: trigger ? 4 : 4,
    });
};

function GameTablesDialog(props) {
    const classes = useStyles();
    const open = useSelector(state => state.GameTablesDialogReducer.open);
    const countdowns = useSelector(state => state.GameTablesDialogReducer.countdowns);
    const tables = useSelector(state => state.HallPageReducer.tables);
    const tablesHistory = useSelector(state => state.HallPageReducer.tablesHistory);
    const user = useSelector(state => state.LoginDialogReducer.user);
    const userDetails = useSelector(state => state.LoginDialogReducer.userDetails);
    const scoreBoardOpen = useSelector(state => state.ScoreboardReducer.open);
    const dispatch = useDispatch();
    const startedTables = useRef([]);
    const lockCards = useRef(false);

    const calculateTimeBeforePassingTurn = (table) => {
        if (table.playedCards[table.round][table.subRound].filter(card => card === -1).length === 1) return 3000;
        else return 0;
    };

    useEffect(() => {
        function closeTableIntervalFunc(table, key) {
            dispatch(resetGameTablesDialogCountdowns(key));
            if (moment().utc().isSameOrAfter(moment(new Date(table.clock))) || user.uid === table.closerUid) {
                clearInterval(startedTables.current.filter(el => el.key === key)[0].interval);
                startedTables.current = startedTables.current.filter(el => el.key !== key);

                if (user.uid === table.closerUid) {
                    // I'm the closer and I have to move table in History
                    retryPromise(deleteFirebase, ['tables', key], MAX_CALL_RETRY)
                        .then(() => {
                            retryPromise(moveTableToHistory, [key, table], MAX_CALL_RETRY)
                                .catch(error => {
                                    // dead
                                })
                        })
                        .catch(error => {
                            // dead
                        });
                }
                else {
                    if (Object.entries(tables).filter(([k, tab]) => k === key).length > 0) {
                        // after clock interval time no one closed table
                        console.log("closing table from signalabsence");
                        retryPromise(signalAbsence, [key, user.uid], MAX_CALL_RETRY)
                            .then(result => {
                                if (result.committed) {
                                    retryPromise(deleteFirebase, ['tables', key], MAX_CALL_RETRY)
                                        .then(() => {
                                            retryPromise(moveTableToHistory, [key, table], MAX_CALL_RETRY)
                                                .catch(error => {
                                                    // dead
                                                })
                                        })
                                        .catch(error => {
                                            // dead
                                        });
                                }
                            })
                            .catch(error => {
                                // dead
                            });
                    }
                }
            }
        }

        function scoreBoardIntervalFunc(table, key) {
            dispatch(resetGameTablesDialogCountdowns(key));
            if (moment().utc().isSameOrAfter(moment(new Date(table.clock)))) {
                clearInterval(startedTables.current.filter(el => el.key === key)[0].interval);
                startedTables.current = startedTables.current.filter(el => el.key !== key);

                if (table.turnIndex === table.participants.indexOf(user.uid)) {
                    let newTurnIndex = (table.turnIndex + 1) % table.players;
                    let newClock = moment().add(table.timePlay, 'seconds').utc().toString();
                    retryPromise(passTurn, [key, table.round, table.subRound, newTurnIndex, newClock, user.uid], MAX_CALL_RETRY)
                        .then(() => {
                            lockCards.current = false;
                        })
                        .catch(error => {
                            // dead
                        });
                }
                else {
                    retryPromise(signalAbsence, [key, user.uid], MAX_CALL_RETRY)
                        .then(result => {
                            if (result.committed) {
                                setTimeout(() => {
                                    if (table.scoreBoardOpen) {
                                        // no one closed the scoreBoard after additional 2 secs
                                        let newTurnIndex = (table.turnIndex + 1) % table.players;
                                        let newClock = moment().add(table.timePlay, 'seconds').utc().toString();
                                        retryPromise(passTurn, [key, table.round, table.subRound, newTurnIndex, newClock, user.uid], MAX_CALL_RETRY)
                                            .then(() => {
                                                lockCards.current = false;
                                            })
                                            .catch(error => {
                                                // dead
                                            });
                                    }
                                }, 2000);
                            }
                        })
                        .catch(error => {
                            // dead
                        });
                }
            }
        }

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
                        retryPromise(declarePassTurnAndCleanAbsence, [key, table.round, playerIndex, table.shifts[table.round][0].length, newTurnIndex, newClock], MAX_CALL_RETRY)
                            .catch(error => {
                                // dead
                            });
                    }
                    else {
                        lockCards.current = true;
                        let card = selectOneCardToPlay(table);
                        retryPromise(playCardAndCleanAbsence, [key, table.round, table.subRound, card], MAX_CALL_RETRY)
                            .then(() => {
                                setTimeout(() => {
                                    if (table.playedCards[table.round].flat().filter(card => card === -1).length === 1) {
                                        let newClock = moment().add(SCOREBOARD_TIME, 'seconds').utc().toString();
                                        retryPromise(openScoreBoard, [key, newClock], MAX_CALL_RETRY)
                                            .then(() => {
                                                lockCards.current = false;
                                            })
                                            .catch(error => {
                                                // dead
                                            });
                                    }
                                    else {
                                        let newTurnIndex = (table.turnIndex + 1) % table.players;
                                        let newClock = moment().add(table.timePlay, 'seconds').utc().toString();
                                        retryPromise(passTurn, [key, table.round, table.subRound, newTurnIndex, newClock, user.uid], MAX_CALL_RETRY)
                                            .then(() => {
                                                lockCards.current = false;
                                            })
                                            .catch(error => {
                                                // dead
                                            });
                                    }

                                }, calculateTimeBeforePassingTurn(table));
                            })
                            .catch(error => {
                                // dead
                            });
                    }
                }
                else {
                    // Someone is online and some other one didn't answer in time: 
                    retryPromise(signalAbsence, [key, user.uid], MAX_CALL_RETRY)
                        .then(result => {
                            if (result.committed) {
                                // I am the user that play instead of missing player
                                setTimeout(() => {
                                    if (startedTables.current.filter(el => el.key === key).length === 0) {
                                        // no one answer after 3 additional seconds of wait
                                        if (table.declarations[table.round][table.turnIndex] === -1) {
                                            let playerIndex = table.turnIndex;
                                            let newTurnIndex = (table.turnIndex + 1) % table.players;
                                            let newClock = moment().add(table.timePlay, 'seconds').utc().toString();
                                            retryPromise(declarePassTurnAndCleanAbsence, [key, table.round, playerIndex, table.shifts[table.round][0].length, newTurnIndex, newClock], MAX_CALL_RETRY)
                                                .catch(error => {
                                                    // dead
                                                });
                                        }
                                        else {
                                            let card = selectOneCardToPlay(table);
                                            retryPromise(playCardAndCleanAbsence, [key, table.round, table.subRound, card], MAX_CALL_RETRY)
                                                .then(() => {
                                                    setTimeout(() => {
                                                        if (table.playedCards[table.round].flat().filter(card => card === -1).length === 1) {
                                                            let newClock = moment().add(SCOREBOARD_TIME, 'seconds').utc().toString();
                                                            retryPromise(openScoreBoard, [key, newClock], MAX_CALL_RETRY)
                                                                .then(() => {
                                                                    lockCards.current = false;
                                                                })
                                                                .catch(error => {
                                                                    // dead
                                                                });
                                                        }
                                                        else {
                                                            let newTurnIndex = (table.turnIndex + 1) % table.players;
                                                            let newClock = moment().add(table.timePlay, 'seconds').utc().toString();
                                                            retryPromise(passTurn, [key, table.round, table.subRound, newTurnIndex, newClock, user.uid], MAX_CALL_RETRY)
                                                                .catch(error => {
                                                                    // dead
                                                                });
                                                        }

                                                    }, calculateTimeBeforePassingTurn(table));
                                                })
                                                .catch(error => {
                                                    // dead
                                                });
                                        }
                                    }
                                }, 3000);
                            }
                        })
                        .catch(error => {
                            // dead
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
                if (startedArray[i].table.started && !moment().utc().isSameOrAfter(moment(new Date(startedArray[i].table.started))) && !startedArray[i].table.closed) {
                    if (!startedTables.current.map(el => el.key).includes(startedArray[i].key)) {
                        let newObj = {
                            key: startedArray[i].key, interval: setInterval(intervalFunc, 1000, startedArray[i].table, startedArray[i].key)
                        };
                        startedTables.current.push(newObj);
                    }
                }

                if (startedArray[i].table.clock && moment().utc().isSameOrAfter(moment(new Date(startedArray[i].table.started)))
                    && !moment().utc().isSameOrAfter(moment(new Date(startedArray[i].table.clock))) && !startedArray[i].table.scoreBoardOpen && !startedArray[i].table.closed) {
                    if (!startedTables.current.map(el => el.key).includes(startedArray[i].key)) {
                        let newObj = {
                            key: startedArray[i].key, interval: setInterval(answerIntervalFunc, 1000, startedArray[i].table, startedArray[i].key)
                        };
                        startedTables.current.push(newObj);
                    }
                }

                if (startedArray[i].table.clock && moment().utc().isSameOrAfter(moment(new Date(startedArray[i].table.started)))
                    && !moment().utc().isSameOrAfter(moment(new Date(startedArray[i].table.clock))) && startedArray[i].table.scoreBoardOpen && !startedArray[i].table.closed) {
                    if (!startedTables.current.map(el => el.key).includes(startedArray[i].key)) {
                        let newObj = {
                            key: startedArray[i].key, interval: setInterval(scoreBoardIntervalFunc, 1000, startedArray[i].table, startedArray[i].key)
                        };
                        startedTables.current.push(newObj);
                    }
                }

                if (startedArray[i].table.closed && !moment().utc().isSameOrAfter(moment(new Date(startedArray[i].table.clock)))) {
                    if (!startedTables.current.map(el => el.key).includes(startedArray[i].key)) {
                        let newObj = {
                            key: startedArray[i].key, interval: setInterval(closeTableIntervalFunc, 1000, startedArray[i].table, startedArray[i].key)
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
                <div>
                    <Tooltip title="Delete table" placement="bottom">
                        <span>
                            <IconButton onClick={() => handleTableDelete(key, table)} disabled={table.started !== undefined}>
                                <DeleteOutline />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Open Scoreboard" placement="bottom">
                        <span>
                            <IconButton onClick={() => dispatch(toggleScoreboard({ key: key, value: true }))}
                                disabled={table.scoreBoardOpen || table.started === undefined || !moment().utc().isSameOrAfter(moment(new Date(table.started)))}>
                                <Poll />
                            </IconButton>
                        </span>
                    </Tooltip>
                </div>

            );
        }
        if (table.authorUid !== user.uid) {
            return (
                <div>
                    <Tooltip title="Leave table" placement="bottom">
                        <span>
                            <IconButton onClick={() => handleTableLeave(key, table)} disabled={table.started !== undefined}>
                                <DirectionsRun />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Open Scoreboard" placement="bottom">
                        <span>
                            <IconButton onClick={() => dispatch(toggleScoreboard({ key: key, value: true }))}
                                disabled={table.scoreBoardOpen || table.started === undefined || !moment().utc().isSameOrAfter(moment(new Date(table.started)))}>
                                <Poll />
                            </IconButton>
                        </span>
                    </Tooltip>
                </div>

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
        else if (lockCards.current) {
            dispatch(setSnackbarMessage('You already played a card, wait your next turn. Thanks'));
            dispatch(setSnackbarSeverity('warning'));
            dispatch(toggleSnackbarOpen(true));
        }
        else {
            if (mayIPlayThisCard(table, card)) {
                lockCards.current = true;
                let filter = startedTables.current.filter(el => el.key === key);
                if (filter.length > 0) {
                    clearInterval(filter[0].interval);
                    startedTables.current = startedTables.current.filter(el => el.key !== key);
                    dispatch(resetGameTablesDialogCountdowns(key));
                }

                playCardAndCleanAbsence(key, table.round, table.subRound, card)
                    .then(() => {
                        setTimeout(() => {
                            if (table.playedCards[table.round].flat().filter(card => card === -1).length === 1) {
                                let newClock = moment().add(SCOREBOARD_TIME, 'seconds').utc().toString();
                                retryPromise(openScoreBoard, [key, newClock], MAX_CALL_RETRY)
                                    .then(() => {
                                        lockCards.current = false;
                                    })
                                    .catch(error => {
                                        // dead
                                    });
                            }
                            else {
                                let newTurnIndex = (table.turnIndex + 1) % table.players;
                                let newClock = moment().add(table.timePlay, 'seconds').utc().toString();
                                retryPromise(passTurn, [key, table.round, table.subRound, newTurnIndex, newClock, user.uid], MAX_CALL_RETRY)
                                    .then(() => {
                                        lockCards.current = false;
                                    })
                                    .catch(error => {
                                        // dead
                                    });
                            }

                        }, calculateTimeBeforePassingTurn(table));
                    })
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

    const otherPlayersCardPosition = (index, cardIndex, round) => {
        switch (index) {
            case 0:
                switch (cardIndex) {
                    case 0:
                        switch (round) {
                            case 0:
                            case 8:
                                return classes.otherPlayerCardPositionLeftFirstRound0;
                            case 1:
                            case 7:
                                return classes.otherPlayerCardPositionLeftFirstRound1;
                            case 2:
                            case 6:
                                return classes.otherPlayerCardPositionLeftFirstRound2;
                            case 3:
                            case 5:
                                return classes.otherPlayerCardPositionLeftFirstRound3;
                            case 4:
                                return classes.otherPlayerCardPositionLeftFirstRound4;
                            default:
                                return null;
                        }
                    default:
                        return classes.otherPlayerCardPositionLeft;
                }
            case 1:
                switch (cardIndex) {
                    case 0:
                        return classes.otherPlayerCardPositionTopLeftFirst;
                    default:
                        return classes.otherPlayerCardPositionTopLeft;
                }
            case 2:
                switch (cardIndex) {
                    case 0:
                        return classes.otherPlayerCardPositionTopFirst;
                    default:
                        return classes.otherPlayerCardPositionTop;
                }
            case 3:
                switch (cardIndex) {
                    case 0:
                        return classes.otherPlayerCardPositionTopRightFirst;
                    default:
                        return classes.otherPlayerCardPositionTopRight;
                }
            case 4:
                switch (cardIndex) {
                    case 0:
                        return classes.otherPlayerCardPositionRightFirst;
                    default:
                        return classes.otherPlayerCardPositionRight;
                }
            case 5:
                switch (cardIndex) {
                    case 0:
                        return classes.otherPlayerCardPositionBottomRightFirst;
                    default:
                        return classes.otherPlayerCardPositionBottomRight;
                }
            case 6:
                switch (cardIndex) {
                    case 0:
                        return classes.otherPlayerCardPositionBottomFirst;
                    default:
                        return classes.otherPlayerCardPositionBottom;
                }
            case 7:
                switch (cardIndex) {
                    case 0:
                        return classes.otherPlayerCardPositionBottomLeftFirst;
                    default:
                        return classes.otherPlayerCardPositionBottomLeft;
                }
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

    const getTableStatus = (table) => {
        if (!table.closed) {
            if (table.started) return { status: "started", icon: <PlayCircleFilled className={classes.playIcon} fontSize="large" /> };
            else return { status: "waiting", icon: <PauseCircleFilled className={classes.pauseIcon} fontSize="large" /> };
        }
        else return { status: "closed", icon: <CheckCircle className={classes.playIcon} fontSize="large" /> };
    };

    function sortTables([key1, table1], [key2, table2]) {
        if (!table1.closed && !table2.closed) return 0;
        if (!table1.closed && table2.closed) return -1;
        if (table1.closed && !table2.closed) return 1;
        if (table1.closed && table2.closed) {
            if (moment(new Date(table1.closed)).isBefore(moment(new Date(table2.closed)))) return -1;
            if (moment(new Date(table1.closed)).isAfter(moment(new Date(table2.closed)))) return 1;
            return 0;
        }
    };

    const avatarCountdownColor = (key) => {
        if (countdowns.filter(el => el.key === key).length > 0) {
            let secondsLeft = countdowns.filter(el => el.key === key)[0].value;
            if (secondsLeft >= 10) return classes.grey;
            else if (secondsLeft < 10 && secondsLeft >= 5) return classes.yellow;
            else return classes.red;
        }
        else return classes.grey;
    };

    return (
        <div>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                keepMounted>
                <ElevationScroll {...props}>
                    <AppBar>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                <Close />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                Game Tables
                                </Typography>
                        </Toolbar>
                    </AppBar>
                </ElevationScroll>
                {tables && tablesHistory && user && Object.entries(tables).filter(([key, table]) => table.participants.includes(user.uid))
                    .concat(Object.entries(tablesHistory).filter(([keyHist, tableHist]) => tableHist.participants.includes(user.uid) && moment().diff(moment(new Date(tableHist.closed)), 'minute') < 5))
                    .sort(sortTables).map(([key, table], i) => (

                        <div className={clsx(classes.cardDiv, i === 0 ? classes.firstCardDiv : null)} key={key}>
                            <Card className={classes.card}>
                                <CardHeader
                                    avatar={
                                        <Tooltip title={"Table status: " + getTableStatus(table).status} placement="bottom">
                                            <Avatar className={classes.avatar}>
                                                {getTableStatus(table).icon}
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
                                        <Zoom in={true}>
                                            <div className={classes.countdownDiv}>
                                                {/* INITIAL COUNDOWN */}
                                                <CircularProgress className={classes.circularCountdown} variant="static" size='4em' value={countdowns.filter(el => el.key === key).length > 0 ?
                                                    100 - (countdowns.filter(el => el.key === key)[0].value * 10 / 6) : 0} />
                                                <Typography className={classes.circularLabel} variant="body1" >{countdowns.filter(el => el.key === key).length > 0 ?
                                                    countdowns.filter(el => el.key === key)[0].value : 0}''
                                            </Typography>
                                            </div>
                                        </Zoom>}
                                    {!table.started && !moment().utc().isSameOrAfter(moment(new Date(table.started))) &&
                                        <Zoom in={true}>
                                            <div className={classes.countdownDiv}>
                                                {/* WAITING MESSAGE */}
                                                <Typography className={classes.circularLabel} variant="body1" >Waiting for other {table.players - table.participants.length} participant(s)...</Typography>
                                            </div>
                                        </Zoom>}
                                    {table.started && moment().utc().isSameOrAfter(moment(new Date(table.started))) &&
                                        <div>
                                            <div className={clsx(classes.playCardsDiv, cardPosition(table.round, table.participants.indexOf(user.uid)))}>
                                                {/* CARDS */}
                                                {table.shifts[table.round][table.participants.indexOf(user.uid)].map((card, j) => (
                                                    <Zoom in={true} key={j}>
                                                        <Button className={classes.playCardButton} onClick={() => selectCard(key, table, card)} disableFocusRipple disableRipple
                                                            disabled={table.playedCards[table.round].flat().includes(card)}>
                                                            {table.playedCards[table.round].flat().includes(card) ?
                                                                <img src={playCardImages['Red_back.jpg']} alt="card" className={classes.playCardImage} /> :
                                                                <img src={playCardImages[card + '.jpg']} alt="card" className={classes.playCardImage} />}
                                                        </Button>
                                                    </Zoom>
                                                ))}
                                            </div>
                                            <div>
                                                {/* OTHER PLAYERS CARDS */}
                                                {table.participants.filter((otherUser, otherUserIndex) => otherUserIndex !== table.participants.indexOf(user.uid))
                                                    .map((otherUser, otherUserIndex) => (
                                                        <div key={otherUserIndex} className={classes.otherPlayerCardImageDiv}>
                                                            {table.shifts[table.round][table.participants.indexOf(otherUser)].filter((otherUserCard, otherUserCardIndex) => !table.playedCards[table.round].flat().includes(otherUserCard))
                                                                .map((otherUserCard, otherUserCardIndex) => (
                                                                    <div key={otherUserCardIndex} className={otherPlayersCardPosition(table.participants.indexOf(otherUser), otherUserCardIndex, table.round)}>
                                                                        <img src={playCardImages['Red_back.jpg']} alt="card" className={classes.otherPlayerCardImage} />
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    ))}
                                            </div>
                                            <div className={classes.jollyDiv}>
                                                {/* JOLLY */}
                                                <Zoom in={true}>
                                                    <Tooltip title={"Jolly seed: " + getJollySeed(table.jolly[table.round])} placement="bottom">
                                                        <div className={classes.jollyTooltipDiv}>
                                                            <FiberManualRecord fontSize='inherit' className={classes.jollyIcon} />
                                                            <img src={playCardImages[getJollySeed(table.jolly[table.round]) + '.png']} className={classes.jollyImage} alt="jolly-seed" />
                                                        </div>
                                                    </Tooltip>
                                                </Zoom>
                                            </div>
                                        </div>
                                    }
                                    {table.started && moment().utc().isSameOrAfter(moment(new Date(table.started))) && table.turnIndex === table.participants.indexOf(user.uid) &&
                                        table.declarations[table.round][table.turnIndex] === -1 &&
                                        <Zoom in={true}>
                                            <div className={classes.declarationDiv}>
                                                {/* DECLARATIONS */}
                                                <Typography className={classes.declarationText} variant="body1" >It's your turn! How many rounds you will win?</Typography>
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
                                            </div>
                                        </Zoom>}
                                    {table.started && moment().utc().isSameOrAfter(moment(new Date(table.started))) && table.turnIndex !== table.participants.indexOf(user.uid) &&
                                        table.declarations[table.round].includes(-1) &&
                                        <Zoom in={true}>
                                            <div className={classes.declarationDiv}>
                                                {/* OTHER PLAYERS DECLARATIONS */}
                                                {table.participants.filter(uid => table.turnIndex === table.participants.indexOf(uid))
                                                    .map((uid, i) => (
                                                        <div key={i} className={classes.otherDeclarationDiv}>
                                                            {(!userDetails || !getUserDetailsByUid(uid).photoURL) &&
                                                                <Avatar key={i} className={classes.otherDeclarationAvatar}>
                                                                    <Face color="primary" className={classes.avatarIcon} />
                                                                </Avatar>}
                                                            {userDetails && getUserDetailsByUid(uid).photoURL &&
                                                                <Avatar src={getUserDetailsByUid(uid).photoURL} className={classes.otherDeclarationAvatar} />
                                                            }
                                                            {userDetails &&
                                                                <Typography className={classes.otherDeclarationText}>It's {getUserDetailsByUid(uid).displayName} turn. Please, wait...</Typography>}
                                                        </div>
                                                    ))}

                                            </div>
                                        </Zoom>}
                                    {table.started && moment().utc().isSameOrAfter(moment(new Date(table.started))) && !table.declarations[table.round].includes(-1) &&
                                        <div className={classes.playedCardsDiv}>
                                            {/* PLAYED CARDS */}
                                            {table.playedCards[table.round][table.subRound].filter(el => el !== -1).map((card) => (
                                                <Zoom in={true} key={card}>
                                                    <img src={playCardImages[card + '.jpg']} alt="card"
                                                        className={classes.playedCardImage} />
                                                </Zoom>
                                            ))}
                                            {/* WINNER NAME */}
                                            {userDetails && table.playedCards[table.round][table.subRound].every(card => card !== -1) &&
                                                <Zoom in={true}>
                                                    <Typography className={classes.winnerNameText}>
                                                        {getUserDetailsByUid(table.participants[determinateSubTurnWinnerIndex(table)]).displayName} wins!
                                                    </Typography>
                                                </Zoom>}
                                        </div>
                                    }
                                    {userDetails && scoreBoardOpen && table.started && moment().utc().isSameOrAfter(moment(new Date(table.started))) &&
                                        (table.scoreBoardOpen || (scoreBoardOpen.filter(el => el.key === key).length > 0 ? scoreBoardOpen.filter(el => el.key === key)[0].value : false)) &&
                                        <Slide direction="up" in={true}>
                                            <div className={classes.scoreBoardDiv}>
                                                {/* SCOREBOARD */}
                                                <Scoreboard id={key} table={table} userDetails={userDetails} />
                                            </div>
                                        </Slide>}
                                    {/* PLAYERS AVATAR */}
                                    <div>
                                        {table.participants.map((uid, i) => (
                                            <Zoom in={true} key={i}>
                                                <div className={clsx(classes.avatarDiv, avatarPosition(i))}>
                                                    {(!userDetails || !getUserDetailsByUid(uid).photoURL) &&
                                                        <Avatar key={i} className={classes.avatar}>
                                                            <Face color="primary" className={classes.avatarIcon} />
                                                        </Avatar>}
                                                    {userDetails && getUserDetailsByUid(uid).photoURL &&
                                                        <Avatar src={getUserDetailsByUid(uid).photoURL} className={classes.avatar} />
                                                    }
                                                    {userDetails && <Typography className={classes.avatarName}>{getUserDetailsByUid(uid).displayName}</Typography>}
                                                    {table.started && moment().utc().isSameOrAfter(moment(new Date(table.started))) && table.turnIndex === table.participants.indexOf(uid) &&
                                                        <CircularProgress variant="static" size='4em' className={clsx(classes.avatarCircularProgress, avatarCountdownColor(key))} value={countdowns.filter(el => el.key === key).length > 0 ?
                                                            100 - (countdowns.filter(el => el.key === key)[0].value * 100 / table.timePlay) : 0} />}
                                                    {table.started && table.declarations[table.round][table.participants.indexOf(uid)] !== -1 &&
                                                        <div className={classes.declarationIconDiv}>
                                                            <Typography variant="body1" className={classes.declarationIconText}>
                                                                {table.points[table.round][table.participants.indexOf(uid)]}/{table.declarations[table.round][table.participants.indexOf(uid)]}
                                                            </Typography>
                                                        </div>}
                                                </div>
                                            </Zoom>
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