import React, { useEffect } from 'react';
import LoginForm from '../Login/LoginForm/LoginForm';
import ForgotPassword from '../Login/ForgotPassword/ForgotPassword';
import { Route, Routes } from 'react-router-dom';
import { IS_AUTHENTICATED } from '../../utils/globalConstants';
import WithRouter from '../../hoc/withRouter';
import { clearStorage } from '../../utils/commonfunctions/commonfunctions';

function Authentication() {
    useEffect(() => {
        if (!!localStorage.getItem(IS_AUTHENTICATED)) {
            clearStorage();
            if (location.pathname !== '/forgotpassword') {
                navigate('/login');
            }
        }
    }, [location.pathname]);

    return (
        <Routes>
            <Route path='/login' element={<LoginForm />} />
            <Route path='/forgotpassword' element={<ForgotPassword />} />
        </Routes>
    );
}

export default WithRouter(Authentication);
