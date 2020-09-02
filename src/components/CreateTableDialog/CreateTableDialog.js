import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { useSelector, useDispatch } from 'react-redux';
import { toggleCreateTableDialog } from './CreateTableDialogAction';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { TABLENAME_MAX_LENGTH, TABLENAME_MIN_LENGTH } from '../../libs/constants';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import clsx from 'clsx';
import { insertFirebase } from '../../libs/firebaseRedux';

const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.primary.main
    },
    actionButton: {
        textTransform: 'none'
    },
    formControl: {
        width: '100%',
    },
    marginBottom: {
        marginBottom: '1em'
    },
    textField: {
        width: '100%',
        marginRight: 0,
        marginLeft: 0
    },
    checkBoxesDiv: {
        display: 'inline-flex',
        marginTop: '1em',
    },
    checkBoxesLabel: {
        marginTop: '0.79em',
        paddingRight: '2.5em'
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function CreateTableDialog() {
    const classes = useStyles();
    const open = useSelector(state => state.CreateTableDialogReducer.open);
    const dispatch = useDispatch();
    const [tableName, setTableName] = useState('my Sballo table');
    const [players, setPlayers] = useState(4);
    const [timeToPlay, setTimeToPlay] = useState(45);
    const [bet, setBet] = useState(0);

    const playersValues = [2, 3, 4, 5, 6, 7];
    const timeValues = [15, 30, 45, 60];

    const tableNameFormError = tableName.length < TABLENAME_MIN_LENGTH || tableName.length > TABLENAME_MAX_LENGTH;
    const betFormError = bet < 0;
    const playersFormError = !playersValues.includes(players);
    const timeFormError = !timeValues.includes(timeToPlay);

    const handleClose = () => {
        dispatch(toggleCreateTableDialog(false));
    };

    const handleCreate = () => {
        let newTable = {
            name: tableName,
            bet: bet,
            timePlay: timeToPlay,
            players: players
        };
        insertFirebase('tables', newTable);
        dispatch(toggleCreateTableDialog(false));
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
                <DialogTitle className={classes.title}>{"Create Sballo table"}</DialogTitle>
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
                    <FormControl required error={betFormError} component="fieldset" className={classes.formControl} >
                        <FormControlLabel className={classes.textField} control={
                            <TextField
                                label="Bet"
                                type="number"
                                required
                                error={betFormError}
                                value={bet}
                                onChange={(event) => setBet(Number(event.target.value))}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />} />
                        {betFormError && <FormHelperText>Bet must be positive</FormHelperText>}
                    </FormControl>
                    <FormControl required error={playersFormError} component="fieldset" className={classes.formControl} >
                        <FormGroup>
                            <div className={classes.checkBoxesDiv}>
                                <FormLabel className={classes.checkBoxesLabel} component="legend">Players</FormLabel>
                                {playersValues.map(el =>
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
                                {timeValues.map(el =>
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
                    <Button className={classes.actionButton} onClick={handleCreate} color="primary"
                        disabled={tableNameFormError || betFormError || playersFormError || timeFormError}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CreateTableDialog;