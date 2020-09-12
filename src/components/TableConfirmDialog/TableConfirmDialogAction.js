export const toggleTableConfirmDialog = data => ({
    type: 'TOGGLE_TABLECONFIRMDIALOG',
    payload: { open: data }
});

export const setTableConfirmDialogId = data => ({
    type: 'SET_TABLECONFIRMDIALOG_ID',
    payload: { id: data }
});

export const setTableConfirmDialogMode = data => ({
    type: 'SET_TABLECONFIRMDIALOG_MODE',
    payload: { mode: data }
});

export const setTableConfirmDialogTable = data => ({
    type: 'SET_TABLECONFIRMDIALOG_TABLE',
    payload: { table: data }
});