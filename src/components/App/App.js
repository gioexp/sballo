import React from 'react';
import { BrowserRouter, Switch, Route, Router } from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import Header from '../Header/Header';
import HallPage from '../HallPage/HallPage';
import { Routes } from '../../libs/constants';
import { createBrowserHistory } from 'history';
import ShopPage from '../ShopPage/ShopPage';
import SettingsPage from '../SettingsPage/SettingsPage';
import CreditsPage from '../CreditsPage/CreditsPage';
import ContactUsPage from '../ContactUsPage/ContactUsPage';

const history = createBrowserHistory();

function App() {
    return (
        <BrowserRouter>
            <Router history={history}>
                <Header history={history}/>
                <Switch>
                    <Route exact path={Routes.HomePage.pathname} component={HomePage} />
                    <Route exact path={Routes.HallPage.pathname} component={HallPage} />
                    <Route exact path={Routes.ShopPage.pathname} component={ShopPage} />
                    <Route exact path={Routes.SettingsPage.pathname} component={SettingsPage} />
                    <Route exact path={Routes.CreditsPage.pathname} component={CreditsPage} />
                    <Route exact path={Routes.ContactUsPage.pathname} component={ContactUsPage} />
                </Switch>
            </Router>
        </BrowserRouter>
    );
}

export default App;
