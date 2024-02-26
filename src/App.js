import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import './styles/styles.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginForm from './container/Login/LoginForm/LoginForm';
import { useDispatch, useSelector } from 'react-redux';
import Authentication from './container/Authentication/Authentication';
import Loader from './container/common/Loader/Loader';
import SiteLayout from './container/SiteLayout/SiteLayout';
import { IS_AUTHENTICATED } from './utils/globalConstants';
import { loginAction } from './store/actions/loginaction';

function App() {
    // const [loggedIn, setLoggedIn] = useState(false);
    const dispatch = useDispatch();
    const redCtx = useSelector((state) => state.login);
    console.log(redCtx);

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
