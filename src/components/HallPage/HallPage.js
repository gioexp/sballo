import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { toggleCreateTableDialog } from '../CreateTableDialog/CreateTableDialogAction';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
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
    }
}));

function HallPage() {
    const classes = useStyles();
    const tables = useSelector(state => state.HallPageReducer.tables);
    const dispatch = useDispatch();

    const addButtonClick = () => {
        dispatch(toggleCreateTableDialog(true));
    }

    return (
        <div className={classes.root}>
            {tables && <div>{Object.values(tables)[0].name}</div>}
            <Button variant="outlined" color="primary" className={classes.addButton}
                onClick={addButtonClick} >
                <AddIcon fontSize="large" />
            </Button>
        </div>
    );
}

export default HallPage;