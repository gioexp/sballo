import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { toggleCreateTableDialog } from '../CreateTableDialog/CreateTableDialogAction';
import {
    Button, List, ListItem, ListItemText, Divider, CircularProgress, ListItemIcon, ListItemSecondaryAction,
    Typography
} from '@material-ui/core';
import { AttachMoney, Add } from '@material-ui/icons';
import moment from 'moment';

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
        borderWidth: 3,
        borderRadius: '50%',
        borderColor: theme.palette.primary.main,
        height: '4.5em',
        width: '4em',
        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
        '&:hover': {
            borderWidth: 3,
        },
    },
    list: {
        width: '50%'
    },
    loading: {
        marginTop: '20em'
    },
    secondaryAction: {
        display: 'inline-flex',
    },
    greyText: {
        color: 'rgba(0, 0, 0, 0.54)',
    },
    betDiv: {
        marginRight: '3em',
        marginTop: '0.25em'
    },
    playersDiv: {
        marginTop: '0.25em',
        marginRight: '6em',
    },
    createdDiv: {
        marginTop: '0.25em'
    }
}));

function HallPage() {
    const classes = useStyles();
    const tables = useSelector(state => state.HallPageReducer.tables);
    const dispatch = useDispatch();
    const [actualTime, setActualTime] = useState(moment());

    const addButtonClick = () => {
        dispatch(toggleCreateTableDialog(true));
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setActualTime(moment());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={classes.root}>
            {tables &&
                <List className={classes.list}>
                    {Object.entries(tables).map(([key, table]) => (
                        <div key={key}>
                            <ListItem button>
                                <ListItemIcon>
                                    <AttachMoney fontSize='large' color='primary' />
                                </ListItemIcon>
                                <ListItemText
                                    primary={table.name}
                                    secondary={'made by: ' + table.author}
                                />
                                <ListItemSecondaryAction className={classes.secondaryAction}>
                                    <div className={classes.betDiv}>
                                        <Typography variant="body1" color="inherit" align="center" className={classes.greyText}>
                                            bet
                                    </Typography>
                                        <Typography variant="body1" color="inherit" align="center">
                                            {table.bet}
                                        </Typography>
                                    </div>
                                    <div className={classes.playersDiv}>
                                        <Typography variant="body1" color="inherit" align="center" className={classes.greyText}>
                                            players
                                    </Typography>
                                        <Typography variant="body1" color="inherit" align="center">
                                            {table.players}
                                        </Typography>
                                    </div>
                                    <div className={classes.createdDiv}>
                                        <Typography variant="body1" color="inherit" align="center" className={classes.greyText}>
                                            created
                                    </Typography>
                                        <Typography variant="body1" color="inherit" align="center">
                                            {actualTime.diff(moment(new Date(table.timestamp)), 'minute') === 0 ? 'Now' : actualTime.diff(moment(new Date(table.timestamp)), 'minute') + '\''}
                                        </Typography>
                                    </div>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider component="li" />
                        </div>
                    ))}
                </List>}
            {!tables &&
                <CircularProgress size='7em' className={classes.loading} />
            }
            <Button variant="outlined" color="primary" className={classes.addButton}
                onClick={addButtonClick} >
                <Add fontSize="large" />
            </Button>
        </div>
    );
}

export default HallPage;