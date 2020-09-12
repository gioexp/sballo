import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Dialog, AppBar, Toolbar, IconButton, Typography, Slide, Card, CardHeader, CardContent, CardActions,
    Tooltip, Avatar, CircularProgress
} from '@material-ui/core';
import { Close, DeleteOutline, AttachMoney, Group, Timer, DirectionsRun, PlayCircleFilled, PauseCircleFilled, Face } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { toggleGameTablesDialog, setGameTablesDialogCountdowns } from './GameTablesDialogAction';
import clsx from 'clsx';
import { toggleTableConfirmDialog, setTableConfirmDialogId, setTableConfirmDialogMode, setTableConfirmDialogTable } from '../TableConfirmDialog/TableConfirmDialogAction';
import PokerTable from '../../images/poker_table.jpg';
import { green, grey } from '@material-ui/core/colors';
import moment from 'moment';

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
        backgroundSize: '45%',
        height: '35em'
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
        marginTop: '6.3%'
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
        // backgroundColor: 'rgba(0,0,0,0.3)',
        width: '93.3%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    circularCountdown: {
        color: green[500]
    },
    circularLabel: {
        position: 'absolute',
        color: 'rgba(0, 0, 0, 0.54)',
    }
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
        function intervalFunc(started, key) {
            dispatch(setGameTablesDialogCountdowns({ key: key, started: started }));
            if (moment().utc().isSameOrAfter(moment(new Date(started)))) {
                clearInterval(startedTables.current.filter(el => el.key === key)[0].interval);
            }
        }

        if (tables && user) {
            let startedArray = Object.entries(tables).filter(([key, table]) => table.participants.includes(user.uid)).map(([key, table]) => {
                return { key: key, started: table.started }
            });
            for (let i = 0; i < startedArray.length; i++) {
                if (startedArray[i].started && !moment().utc().isSameOrAfter(moment(new Date(startedArray[i].started)))) {
                    if (!startedTables.current.map(el => el.key).includes(startedArray[i].key)) {
                        let newObj = {
                            key: startedArray[i].key, interval: setInterval(intervalFunc, 1000, startedArray[i].started, startedArray[i].key)
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

    const getUserDetailsByUid = (uid) => {
        let userDet = Object.values(userDetails).filter(usr => usr.uid === uid);
        if (userDet.length === 0) return { displayName: 'user' };
        else return userDet[0];
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
                                        <CircularProgress className={classes.circularCountdown} variant="static" size='4em' value={countdowns.filter(el => el.key === key).length > 0 ?
                                            100 - (countdowns.filter(el => el.key === key)[0].value * 10 / 6) : 0} />
                                        <Typography className={classes.circularLabel} variant="body1" >{countdowns.filter(el => el.key === key).length > 0 ?
                                            countdowns.filter(el => el.key === key)[0].value : 0}s
                                        </Typography>
                                    </div>}
                                {!table.started && !moment().utc().isSameOrAfter(moment(new Date(table.started))) &&
                                    <div className={classes.countdownDiv}>
                                        <Typography className={classes.circularLabel} variant="body1" >Waiting for other {table.players - table.participants.length} participant(s)...</Typography>
                                    </div>}
                                {table.started && moment().utc().isSameOrAfter(moment(new Date(table.started))) &&
                                    <div className={classes.countdownDiv}>
                                        Table has started
                                    </div>}
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
        </div>
    );
}

export default GameTablesDialog;