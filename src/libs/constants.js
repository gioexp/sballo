export const Routes = {
    'HomePage': { name: 'HomePage', pathname: '/' },
    'HallPage': { name: 'HallPage', pathname: '/hall' },
    'ShopPage': { name: 'ShopPage', pathname: '/shop' },
    'SettingsPage': { name: 'SettingsPage', pathname: '/settings' },
    'CreditsPage': { name: 'CreditsPage', pathname: '/credits' },
    'ContactUsPage': { name: 'ContactUsPage', pathname: '/contactus' },
    'AccountPage': { name: 'AccountPage', pathname: '/account' }
};

export const Theme = {
    palette: {
        primary: {
            contrastText: '#FFFFFF',
            dark: '#101097',
            main: '#101097',
            light: '#101097',
        },
        secondary: {
            contrastText: '#FFFFFF',
            dark: '#FF0000',
            main: '#FF0000',
            light: '#FF0000',
        }
    }
};

export const TABLENAME_MIN_LENGTH = 5;
export const TABLENAME_MAX_LENGTH = 30;

export const NICKNAME_MIN_LENGTH = 5;
export const NICKNAME_MAX_LENGTH = 20;

export const VALID_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const VALID_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_?])(?=.{8,})/;

export const USER_NOT_FOUND = 'auth/user-not-found';
export const WRONG_PASSWORD = 'auth/wrong-password';

export const PLAYERS_VALUES = [2, 3, 4, 5, 6, 7];
export const TIME_VALUES = [15, 30, 45, 60];

export const START_POINTS = 100;