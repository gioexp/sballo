import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { toggleCreateTableDialog } from '../CreateTableDialog/CreateTableDialogAction';
import {
    Button, List, ListItem, ListItemText, Divider, CircularProgress, ListItemIcon, ListItemSecondaryAction,
    Typography, Tooltip, Hidden
} from '@material-ui/core';
import { AttachMoney, Add, CheckCircle, VideogameAsset, ControlPoint, Group, Timer, AccessTime } from '@material-ui/icons';
import moment from 'moment';
import { toggleTableConfirmDialog, setTableConfirmDialogId, setTableConfirmDialogMode, setTableConfirmDialogTable } from '../TableConfirmDialog/TableConfirmDialogAction';
import { toggleSnackbarOpen, setSnackbarMessage, setSnackbarSeverity } from '../Snackbar/SnackbarAction';
import { green, grey } from '@material-ui/core/colors';
import { toggleGameTablesDialog } from '../GameTablesDialog/GameTablesDialogAction';
import _ from 'lodash';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '50.55em',
    },
    addButton: {
        position: 'absolute',
        alignSelf: 'flex-end',
        bottom: '6em',
        right: '2em',
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
        alignSelf: 'flex-end',
        bottom: '12em',
        right: '2em',
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
    list: {
        width: '50%'
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

function HallPage() {
    const classes = useStyles();
    const tables = useSelector(state => state.HallPageReducer.tables);
    const user = useSelector(state => state.LoginDialogReducer.user);
    const dispatch = useDispatch();
    const [actualTime, setActualTime] = useState(moment());

    useEffect(() => {
        const interval = setInterval(() => {
            setActualTime(moment());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const addButtonClick = () => {
        if (user && user.emailVerified) dispatch(toggleCreateTableDialog(true));
        else {
            dispatch(setSnackbarMessage('Before create table please login or verify your email. Thanks'));
            dispatch(setSnackbarSeverity('warning'));
            dispatch(toggleSnackbarOpen(true));
        }
    };

    const openGameTables = () => {
        if (user && user.emailVerified) dispatch(toggleGameTablesDialog(true));
        else {
            dispatch(setSnackbarMessage('Before entering in game tables please login or verify your email. Thanks'));
            dispatch(setSnackbarSeverity('warning'));
            dispatch(toggleSnackbarOpen(true));
        }
    };

    const openTableConfirm = (key, table) => {
        if (table.participants.length < table.players) {
            if (user && user.emailVerified) {
                if (!table.participants.includes(user.uid)) {
                    dispatch(setTableConfirmDialogId(key));
                    dispatch(setTableConfirmDialogTable(table));
                    dispatch(setTableConfirmDialogMode('confirm'));
                    dispatch(toggleTableConfirmDialog(true));
                }
                else {
                    dispatch(setSnackbarMessage('Table is about to start. Wait other participants to join. Thanks'));
                    dispatch(setSnackbarSeverity('info'));
                    dispatch(toggleSnackbarOpen(true));
                }
            }
            else {
                dispatch(setSnackbarMessage('Before join table please login or verify your email. Thanks'));
                dispatch(setSnackbarSeverity('warning'));
                dispatch(toggleSnackbarOpen(true));
            }
        }
        else {
            if (user && user.emailVerified) {
                if (!table.participants.includes(user.uid)) {
                    dispatch(setSnackbarMessage('Table is full. Try with another one.'));
                    dispatch(setSnackbarSeverity('warning'));
                    dispatch(toggleSnackbarOpen(true));
                }
                else {
                    dispatch(toggleGameTablesDialog(true));
                }
            }
            else {
                dispatch(setSnackbarMessage('Before join table please login or verify your email. Thanks'));
                dispatch(setSnackbarSeverity('warning'));
                dispatch(toggleSnackbarOpen(true));
            }
            
        }
    };

    return (
        <div className={classes.root}>
            {tables &&
                <List className={classes.list}>
                    {Object.entries(tables).map(([key, table]) => (
                        <div key={key}>
                            <ListItem button onClick={() => openTableConfirm(key, table)}>
                                <ListItemIcon>
                                    <AttachMoney fontSize='large' color='primary' />
                                </ListItemIcon>
                                <ListItemText
                                    primary={table.name}
                                    secondary={'made by: ' + table.author}
                                />
                                <Hidden mdDown>
                                    <ListItemSecondaryAction className={classes.secondaryAction} button="true" onClick={() => openTableConfirm(key, table)}>
                                        {user && table.participants.includes(user.uid) &&
                                            <div className={classes.checkIconDiv}>
                                                <CheckCircle fontSize='large' className={classes.checkIcon} />
                                            </div>}
                                        <Tooltip title="Bet" placement="bottom">
                                            <div className={classes.betDiv}>
                                                <AttachMoney fontSize="small" className={classes.infoTableIcon} />
                                                <Typography variant="body1" align="center" className={classes.infoTableText}>
                                                    {table.bet}
                                                </Typography>
                                            </div>
                                        </Tooltip>
                                        <Tooltip title="Players" placement="bottom">
                                            <div className={classes.playersDiv}>
                                                <Group fontSize="small" className={classes.infoTableIcon} />
                                                <Typography variant="body1" align="center" className={classes.infoTableText}>
                                                    {table.participants.length + ' / ' + table.players}
                                                </Typography>
                                            </div>
                                        </Tooltip>
                                        <Tooltip title="Play time" placement="bottom">
                                            <div className={classes.timePlayDiv}>
                                                <Timer fontSize="small" className={classes.infoTableIcon} />
                                                <Typography variant="body1" align="center" className={classes.infoTableText}>
                                                    {table.timePlay + '\'\''}
                                                </Typography>
                                            </div>
                                        </Tooltip>
                                        <Tooltip title="Created" placement="bottom">
                                            <div className={classes.createdDiv}>
                                                <AccessTime fontSize="small" className={classes.infoTableIcon} />
                                                <Typography variant="body1" align="center" className={classes.infoTableText}>
                                                    {actualTime.diff(moment(new Date(table.timestamp)), 'minute') === 0 ? 'Now' : actualTime.diff(moment(new Date(table.timestamp)), 'minute') + '\''}
                                                </Typography>
                                            </div>
                                        </Tooltip>
                                    </ListItemSecondaryAction>
                                </Hidden>

                            </ListItem>
                            <Divider component="li" />
                        </div>
                    ))}
                </List>}
            {!tables &&
                <CircularProgress size='7em' className={classes.loading} />
            }
            {tables && _.isEmpty(tables) &&
                <div className={classes.noTablesDiv}>
                    <Typography variant="h4" className={classes.noTables}>No tables available</Typography>
                    <br />
                    <div className={classes.noTablesIconDiv}>
                        <Typography variant="h4" className={classes.noTables}>Create one by clicking button</Typography>
                        <ControlPoint fontSize="large" className={classes.noTablesIcon} />
                    </div>
                </div>
            }
            <Tooltip title="Create new table" placement="left">
                <Button variant="outlined" color="primary" className={classes.addButton}
                    onClick={addButtonClick}>
                    <Add fontSize="large" className={classes.addIcon}/>
                </Button>
            </Tooltip>
            {tables && user && Object.entries(tables).filter(([key, table]) => table.participants.includes(user.uid)).length > 0 &&
                <Tooltip title="Go to game tables" placement="left">
                    <Button variant="outlined" color="primary" className={classes.gameTablesButton}
                        onClick={openGameTables}>
                        <VideogameAsset fontSize="large" className={classes.gameTablesIcon}/>
                    </Button>
                </Tooltip>}
        </div>
    );
}

export default HallPage;