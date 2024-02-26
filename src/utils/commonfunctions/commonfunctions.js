import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN, IS_AUTHENTICATED } from '../globalConstants';
// useNavigate

export const clearStorage = () => {
    localStorage.setItem(ACCESS_TOKEN, '');
    localStorage.setItem(REFRESH_TOKEN, '');
    localStorage.setItem(IS_AUTHENTICATED, false);
    // window.location.pathname = '/login';
};
