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

export const PLAYERS_VALUES = [2, 3, 4, 5, 6, 7, 8];
export const TIME_VALUES = [15, 30, 45, 60];

export const START_POINTS = 100;

export const HEARTS_CARDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export const DIAMONDS_CARDS = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
export const CLUBS_CARDS = [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38];
export const SPADES_CARDS = [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];

export const SCOREBOARD_TIME = 15; // secs
export const MAX_CALL_RETRY = 10;

export const MAX_TABLES_PER_PLAYER = 4;