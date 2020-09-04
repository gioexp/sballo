export const toggleTableConfirmDialog = data => ({
    type: 'TOGGLE_TABLECONFIRMDIALOG',
    payload: { open: data }
});

export const setTableConfirmDialogId = data => ({
    type: 'SET_TABLECONFIRMDIALOG_ID',
    payload: { id: data }
});