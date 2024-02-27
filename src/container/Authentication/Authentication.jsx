import React, { useEffect } from 'react';
import LoginForm from '../Login/LoginForm/LoginForm';
import ForgotPassword from '../Login/ForgotPassword/ForgotPassword';
import { Navigate, Route, Routes } from 'react-router-dom';
import { IS_AUTHENTICATED } from '../../utils/globalConstants';
import WithRouter from '../../hoc/withRouter';
import { clearStorage } from '../../utils/commonfunctions/commonfunctions';

function Authentication({ location, navigate }) {
    useEffect(() => {
        if (
            !localStorage.getItem(IS_AUTHENTICATED) ||
            localStorage.getItem(IS_AUTHENTICATED) === 'false'
        ) {
            clearStorage();
            if (location.pathname !== '/forgotpassword') {
                navigate('/login', { replace: true });
            }
        }
    }, []);

    return (
        <Routes>
            <Route path='/login' element={<LoginForm />} />
            <Route path='/forgotpassword' element={<ForgotPassword />} />
        </Routes>
    );
}

export default WithRouter(Authentication);
