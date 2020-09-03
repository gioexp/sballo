export const toggleSnackbarOpen = data => ({
    type: 'TOGGLE_SNACKBAR_OPEN',
    payload: { open: data }
});

export const setSnackbarMessage = data => ({
    type: 'SET_SNACKBAR_MESSAGE',
    payload: { message: data }
});

export const setSnackbarSeverity = data => ({
    type: 'SET_SNACKBAR_SEVERITY',
    payload: { severity: data }
});