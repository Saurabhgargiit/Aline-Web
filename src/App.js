import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import './App.css';
import './styles/styles.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import Authentication from './container/Authentication/Authentication';
import Loader from './container/common/Loader/Loader';
import SiteLayout from './container/SiteLayout/SiteLayout';
import { IS_AUTHENTICATED } from './utils/globalConstants';
import { loginAction } from './store/actions/loginaction';

function App() {
    const dispatch = useDispatch();
    const redCtx = useSelector((state) => state); //reduxContext
    // const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (
            !!localStorage.getItem(IS_AUTHENTICATED) ||
            localStorage.getItem(IS_AUTHENTICATED) === 'false'
        ) {
            dispatch(loginAction(false));
        } else if (localStorage.getItem(IS_AUTHENTICATED) === 'true') {
            dispatch(loginAction(true));
        }
    }, []);

    return (
        <>
            <BrowserRouter>
                {/* <Loader /> */}

                {redCtx.loggedIn ? <SiteLayout /> : <Authentication />}
            </BrowserRouter>
        </>
    );
}

export default App;
