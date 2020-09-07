export const toggleLoginDialog = data => ({
    type: 'TOGGLE_LOGINDIALOG',
    payload: { open: data }
});

export const setUserLoggedIn = data => ({
    type: 'SET_USERLOGGEDIN',
    payload: { user: data }
});