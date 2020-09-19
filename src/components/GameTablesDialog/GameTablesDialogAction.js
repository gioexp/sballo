export const toggleGameTablesDialog = data => ({
    type: 'TOGGLE_GAMETABLESDIALOG',
    payload: { open: data }
});

export const setGameTablesDialogCountdowns = data => ({
    type: 'SET_GAMETABLESDIALOG_COUNTDOWNS',
    payload: { countdownsObj: data }
});

export const resetGameTablesDialogCountdowns = data => ({
    type: 'RESET_GAMETABLESDIALOG_COUNTDOWNS',
    payload: { key: data }
});