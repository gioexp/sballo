import React, { useState } from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField, FormControl, FormGroup, FormControlLabel,
    FormHelperText, FormLabel, Checkbox, LinearProgress
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { toggleCreateTableDialog } from './CreateTableDialogAction';
import { TABLENAME_MAX_LENGTH, TABLENAME_MIN_LENGTH, PLAYERS_VALUES, TIME_VALUES, MAX_TABLES_PER_PLAYER } from '../../libs/constants';
import clsx from 'clsx';
import { insertFirebase } from '../../libs/firebaseRedux';
import moment from 'moment';
import { toggleSnackbarOpen, setSnackbarMessage, setSnackbarSeverity } from '../Snackbar/SnackbarAction';
import _ from 'lodash';
import { useStyles } from './CreateTableDialogCss';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function CreateTableDialog() {
    const classes = useStyles();
    const open = useSelector(state => state.CreateTableDialogReducer.open);
    const user = useSelector(state => state.LoginDialogReducer.user);
    const userDetails = useSelector(state => state.LoginDialogReducer.userDetails);
    const tables = useSelector(state => state.HallPageReducer.tables);
    const dispatch = useDispatch();
    const [tableName, setTableName] = useState('My Sballo table');
    const [players, setPlayers] = useState(4);
    const [timeToPlay, setTimeToPlay] = useState(45);
    const [bet, setBet] = useState(0);
    const [loading, setLoading] = useState(false);

    const tableNameFormError = tableName.length < TABLENAME_MIN_LENGTH || tableName.length > TABLENAME_MAX_LENGTH;
    const betNegativeFormError = bet < 0;
    const betEnoughFormError = user && !_.isEmpty(userDetails) && bet > (Object.values(userDetails).filter(el => el.uid === user.uid).length > 0 ?
        Object.values(userDetails).filter(el => el.uid === user.uid)[0].points : 0);
    const playersFormError = !PLAYERS_VALUES.includes(players);
    const timeFormError = !TIME_VALUES.includes(timeToPlay);

    const handleClose = () => {
        dispatch(toggleCreateTableDialog(false));
    };

    const handleCreate = () => {
        if (Object.entries(tables).filter(([key, table]) => table.participants.includes(user.uid)).length < MAX_TABLES_PER_PLAYER) {
            setLoading(true);
            let newTable = {
                timestamp: moment.utc().toString(),
                type: 'sballo',
                name: tableName,
                bet: bet,
                timePlay: timeToPlay,
                players: players,
                participants: [user.uid],
                author: user.displayName,
                authorUid: user.uid
            };
            insertFirebase('tables', newTable)
                .then(result => {
                    dispatch(setSnackbarMessage('Table created!'));
                    dispatch(setSnackbarSeverity('success'));
                    dispatch(toggleSnackbarOpen(true));
                    dispatch(toggleCreateTableDialog(false));
                    setLoading(false);
                })
                .catch(error => {
                    dispatch(setSnackbarMessage('Error while creating table. Retry later...'));
                    dispatch(setSnackbarSeverity('error'));
                    dispatch(toggleSnackbarOpen(true));
                    dispatch(toggleCreateTableDialog(false));
                    setLoading(false);
                });
        }
        else {
            dispatch(setSnackbarMessage('You cannot join more than ' + MAX_TABLES_PER_PLAYER + ' tables at the same time! Sorry'));
            dispatch(setSnackbarSeverity('warning'));
            dispatch(toggleSnackbarOpen(true));
            dispatch(toggleCreateTableDialog(false));
            setLoading(false);
        }
    };

    const handlePlayersChange = (event) => {
        setPlayers(Number(event.target.name));
    };

    const handleTimeToPlayChange = (event) => {
        setTimeToPlay(Number(event.target.name));
    };

    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                fullWidth={true}
                maxWidth={'sm'}>
                <DialogTitle className={classes.title}>
                    <div>
                        {"Create Sballo table"}
                        {loading && <LinearProgress className={classes.loadingBar} />}
                    </div>
                </DialogTitle>
                <DialogContent>
                    <FormControl required error={tableNameFormError} component="fieldset" className={clsx(classes.formControl, classes.marginBottom)} >
                        <FormControlLabel className={classes.textField} control={
                            <TextField
                                label="Table name"
                                className={classes.textField}
                                required
                                error={tableNameFormError}
                                value={tableName}
                                onChange={(event) => setTableName(event.target.value)}
                                inputProps={{ maxLength: TABLENAME_MAX_LENGTH, minLength: TABLENAME_MIN_LENGTH }}
                            />} />
                        {tableNameFormError && <FormHelperText>Table name should be at least {TABLENAME_MIN_LENGTH} chars</FormHelperText>}
                    </FormControl>
                    <FormControl required error={betNegativeFormError || betEnoughFormError} component="fieldset" className={classes.formControl} >
                        <FormControlLabel className={classes.textField} control={
                            <TextField
                                label="Bet"
                                type="number"
                                required
                                error={betNegativeFormError || betEnoughFormError}
                                value={bet}
                                onChange={(event) => setBet(Number(event.target.value))}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />} />
                        {betNegativeFormError && <FormHelperText>Bet must be positive</FormHelperText>}
                        {betEnoughFormError && <FormHelperText>You don't have enough points to bet</FormHelperText>}
                    </FormControl>
                    <FormControl required error={playersFormError} component="fieldset" className={classes.formControl} >
                        <FormGroup>
                            <div className={classes.checkBoxesDiv}>
                                <FormLabel className={classes.checkBoxesLabel} component="legend">Players</FormLabel>
                                {PLAYERS_VALUES.map(el =>
                                    <FormControlLabel
                                        key={el}
                                        control={
                                            <Checkbox
                                                color="primary"
                                                checked={players === el}
                                                onChange={handlePlayersChange}
                                                name={String(el)}
                                            />}
                                        label={el}
                                    />)}
                            </div>
                        </FormGroup>
                    </FormControl>
                    <FormControl required error={timeFormError} component="fieldset" className={classes.formControl} >
                        <FormGroup>
                            <div className={classes.checkBoxesDiv}>
                                <FormLabel className={classes.checkBoxesLabel} component="legend">Play card time</FormLabel>
                                {TIME_VALUES.map(el =>
                                    <FormControlLabel
                                        key={el}
                                        control={
                                            <Checkbox
                                                color="primary"
                                                checked={timeToPlay === el}
                                                onChange={handleTimeToPlayChange}
                                                name={String(el)}
                                            />}
                                        label={el + '\'\''}
                                    />)}
                            </div>
                        </FormGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button className={classes.actionButton} onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button className={classes.actionButton} onClick={handleCreate} color="primary" variant="contained"
                        disabled={loading || tableNameFormError || betNegativeFormError || betEnoughFormError || playersFormError || timeFormError}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CreateTableDialog;