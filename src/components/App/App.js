import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route, Router } from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import Header from '../Header/Header';
import HallPage from '../HallPage/HallPage';
import { Routes, Theme } from '../../libs/constants';
import { createBrowserHistory } from 'history';
import ShopPage from '../ShopPage/ShopPage';
import SettingsPage from '../SettingsPage/SettingsPage';
import CreditsPage from '../CreditsPage/CreditsPage';
import ContactUsPage from '../ContactUsPage/ContactUsPage';
import Footer from '../Footer/Footer';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { initFirebaseRedux } from '../../libs/firebaseRedux';
import CreateTableDialog from '../CreateTableDialog/CreateTableDialog';
import Snackbar from '../Snackbar/Snackbar';
import TableConfirmDialog from '../TableConfirmDialog/TableConfirmDialog';
import LoginDialog from '../LoginDialog/LoginDialog';
import AccountPage from '../AccountPage/AccountPage';
import GameTablesDialog from '../GameTablesDialog/GameTablesDialog';

const history = createBrowserHistory();
const theme = createMuiTheme(Theme);

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        initFirebaseRedux(dispatch);
    }, [dispatch]);

    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <LoginDialog />
                <CreateTableDialog />
                <Snackbar />
                <GameTablesDialog />
                <TableConfirmDialog />
                <Router history={history}>
                    <Header history={history} />
                    <Switch>
                        <Route exact path={Routes.HomePage.pathname} component={HomePage} />
                        <Route exact path={Routes.HallPage.pathname} component={HallPage} />
                        <Route exact path={Routes.ShopPage.pathname} component={ShopPage} />
                        <Route exact path={Routes.SettingsPage.pathname} component={SettingsPage} />
                        <Route exact path={Routes.CreditsPage.pathname} component={CreditsPage} />
                        <Route exact path={Routes.ContactUsPage.pathname} component={ContactUsPage} />
                        <Route exact path={Routes.AccountPage.pathname} component={AccountPage} />
                    </Switch>
                    <Footer />
                </Router>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
