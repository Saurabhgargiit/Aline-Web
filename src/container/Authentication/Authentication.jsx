import React, { useEffect, useState } from 'react';
import LoginForm from '../Login/LoginForm/LoginForm';
import ForgotPassword from '../Login/ForgotPassword/ForgotPassword';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CommonConstants } from '../../utils/globalConstants';
import { CommonUtils } from '../../utils/commonfunctions/commonfunctions';
import WithRouter from '../../hoc/withRouter';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../../store/actions/loginaction';

function Authentication({ location, navigate, setIsLoggedIn }) {
    const { IS_AUTHENTICATED, ACCESS_TOKEN, REFRESH_TOKEN } = CommonConstants;
    const [errorObj, setErrorObj] = useState({
        errorMsg: '',
        errorFlag: false,
        loader: false,
    });
    const fetchedDetails = useSelector((state) => state.login); //reduxContext
    const dispatch = useDispatch();

    useEffect(() => {
        if (location.pathname !== '/forgotpassword') {
            navigate('/login', { replace: true });
        }
    }, []);
    console.log(fetchedDetails);

    useEffect(() => {
        if (!!fetchedDetails?.loggedIn) {
            localStorage.setItem(IS_AUTHENTICATED, true);
            setIsLoggedIn(true);
            // window.location.pathname = '/home';
            // window.location.reload();
        } else if (fetchedDetails?.loggedInData?.loginInfo?.result === 'error') {
            CommonUtils.clearStorage();
            setErrorObj((prevState) => {
                return {
                    ...prevState,
                    errorMsg: fetchedDetails?.loggedInData?.loginInfo?.data,
                    errorFlag: true,
                    loader: false,
                };
            });
        }
    }, [fetchedDetails]);

    return (
        <Routes>
            <Route path='/login' element={<LoginForm />} />
            <Route path='/forgotpassword' element={<ForgotPassword />} />
            <Route path='*' element={<Navigate to={'/login'} />} />
        </Routes>
    );
}

export default WithRouter(Authentication);
