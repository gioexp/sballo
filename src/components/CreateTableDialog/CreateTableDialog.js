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
import { TABLENAME_MAX_LENGTH } from '../../libs/constants';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.primary.main
    },
    actionButton: {
        textTransform: 'none'
    },
    formControl: {
        width: '100%'
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
        paddingRight: '3em'
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function CreateTableDialog() {
    const classes = useStyles();
    const open = useSelector(state => state.CreateTableDialogReducer.open);
    const dispatch = useDispatch();
    const formError = false;  // gestione errori form ci scrivi una condizione che deve ritornare true / false
    const [tableName, setTableName] = useState('');
    const [players, setPlayers] = useState(4);
    const [timeToPlay, setTimeToPlay] = useState(45);
    const [bet, setBet] = useState(0);

    const handleClose = () => {
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
                    <FormControl required error={formError} component="fieldset" className={classes.formControl} >
                        <FormGroup>
                            <FormControlLabel className={classes.textField} control={
                                <TextField
                                    label="Table name"
                                    className={classes.textField}
                                    required
                                    value={tableName}
                                    onChange={(event) => setTableName(event.target.value)}
                                    inputProps={{ maxLength: TABLENAME_MAX_LENGTH }}
                                />} />
                            <br />
                            <FormControlLabel className={classes.textField} control={
                                <TextField
                                    label="Bet"
                                    type="number"
                                    required
                                    value={bet}
                                    onChange={(event) => setBet(Number(event.target.value))}
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />} />
                            <div className={classes.checkBoxesDiv}>
                                <FormLabel className={classes.checkBoxesLabel} component="legend">Players</FormLabel>
                                {[2, 3, 4, 5, 6, 7].map(el =>
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
                            <div className={classes.checkBoxesDiv}>
                                <FormLabel className={classes.checkBoxesLabel} component="legend">Play card time</FormLabel>
                                {[15, 30, 45, 60].map(el =>
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
                    <Button className={classes.actionButton} onClick={handleClose} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CreateTableDialog;