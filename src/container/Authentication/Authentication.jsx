import React, { useEffect, useState } from 'react';
import LoginForm from '../Login/LoginForm/LoginForm';
import ForgotPassword from '../Login/ForgotPassword/ForgotPassword';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CommonConstants } from '../../utils/globalConstants';
import { CommonUtils } from '../../utils/commonfunctions/commonfunctions';
import WithRouter from '../../hoc/withRouter';
import { useSelector } from 'react-redux';

function Authentication({ location, navigate, setIsLoggedIn }) {
    const { IS_AUTHENTICATED, ACCESS_TOKEN, REFRESH_TOKEN } = CommonConstants;
    const [errorObj, setErrorObj] = useState({
        errorMsg: '',
        errorFlag: false,
    });
    const fetchedDetails = useSelector((state) => state.login); //reduxContext
    console.log('Authentication');

    useEffect(() => {
        if (location.pathname !== '/forgotpassword') {
            console.log('entered');
            navigate('/login', { replace: true });
        }
    }, []);

    useEffect(() => {
        if (!!fetchedDetails?.loggedIn) {
            localStorage.setItem(IS_AUTHENTICATED, true);
            setIsLoggedIn(true);
            // window.location.pathname = '/home';
            // window.location.reload();
        } else if (fetchedDetails?.loggedInData?.loginErr?.result === 'error') {
            CommonUtils.clearStorage();
            // setIsLoggedIn(false);
            setErrorObj((prevState) => {
                return {
                    ...prevState,
                    errorMsg: fetchedDetails?.loggedInData?.loginErr?.data?.message,
                    errorFlag: true,
                };
            });
        }
    }, [fetchedDetails]);

    return (
        <>
            <div className='center-position'>
                <img src='/aline-images/logo.png'></img>
            </div>
            <Routes>
                <Route
                    path='/login'
                    element={<LoginForm setErrorObj={setErrorObj} errorObj={errorObj} />}
                />
                <Route path='/forgotpassword' element={<ForgotPassword />} />
                <Route path='*' element={<Navigate to={'/login'} />} />
            </Routes>
        </>
    );
}

export default WithRouter(Authentication);
