import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    List, ListItem, ListItemText, Divider, CircularProgress, ListItemIcon, ListItemSecondaryAction,
    Typography, Tooltip, Hidden, Fade
} from '@material-ui/core';
import { AttachMoney, CheckCircle, ControlPoint, Group, Timer, AccessTime } from '@material-ui/icons';
import moment from 'moment';
import { toggleTableConfirmDialog, setTableConfirmDialogId, setTableConfirmDialogMode, setTableConfirmDialogTable } from '../TableConfirmDialog/TableConfirmDialogAction';
import { toggleSnackbarOpen, setSnackbarMessage, setSnackbarSeverity } from '../Snackbar/SnackbarAction';
import { toggleGameTablesDialog } from '../GameTablesDialog/GameTablesDialogAction';
import _ from 'lodash';
import { useStyles } from './HallPageCss';

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
                        <Fade in={true} key={key}>
                            <div>
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
                        </Fade>
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
        </div>
    );
}

export default HallPage;