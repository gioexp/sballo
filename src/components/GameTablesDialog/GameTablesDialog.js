import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, AppBar, Toolbar, IconButton, Typography, Slide } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { toggleGameTablesDialog } from './GameTablesDialogAction';

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        display: 'flex',
        justifyContent: 'center',
        width: '96%'
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function GameTablesDialog() {
    const classes = useStyles();
    const open = useSelector(state => state.GameTablesReducer.open);
    const tables = useSelector(state => state.HallPageReducer.tables);
    const user = useSelector(state => state.LoginDialogReducer.user);
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(toggleGameTablesDialog(false));
    };

    return (
        <div>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
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
                {/* ininziano i cazzi */}
            </Dialog>
        </div>
    );
}

export default GameTablesDialog;