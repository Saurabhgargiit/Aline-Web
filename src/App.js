import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import './App.css';
import './styles/styles.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Authentication from './container/Authentication/Authentication';
import Loader from './container/common/Loader/Loader';
import SiteLayout from './container/SiteLayout/SiteLayout';
import { CommonConstants } from './utils/globalConstants';
import { loginAction } from './store/actions/loginaction';

function App() {
    const dispatch = useDispatch();
    const { IS_AUTHENTICATED } = CommonConstants;
    // const fetchedDetails = useSelector((state) => state.login); //reduxContext
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem(IS_AUTHENTICATED) === 'true');
    const [isLoading, setIsLoading] = useState(true);

    //Below code is to check if we have to login directly
    // useEffect(() => {
    document.title = 'Aline Patient Manager';
    if (localStorage.getItem(IS_AUTHENTICATED) === 'true') {
        // if (location.pathname !== '/forgotpassword') {
        //     navigate('/login', { replace: true });
        // }
        // const access_token = localStorage.getItem(ACCESS_TOKEN);
        // const refresh_token = localStorage.getItem(REFRESH_TOKEN);
        // const finalRes = {
        //     result: 'success',
        //     data: { access_token: access_token, refresh_token: refresh_token },
        // };
        // setIsLoggedIn(true);
        // dispatch(loginAction(true, false));
    }
    // }, []);
    // console.log(fetchedDetails?.loggedIn);
    //below code is
    // useEffect(() => {
    //     if (
    //         fetchedDetails?.loggedInData?.loginInfo?.result === 'success' &&
    //         fetchedDetails?.loggedInData?.loginInfo?.data !== undefined
    //     ) {
    //     }
    // }, [fetchedDetails?.loggedInData]);

    return (
        <>
            <BrowserRouter>
                {/* <Loader /> */}
                {/* {isLoading?<Loader/>: } */}

                {isLoggedIn ? <SiteLayout /> : <Authentication setIsLoggedIn={setIsLoggedIn} />}
            </BrowserRouter>
            <ToastContainer />
        </>
    );
}

export default App;
