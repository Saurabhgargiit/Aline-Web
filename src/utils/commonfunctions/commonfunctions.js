import { useNavigate } from 'react-router-dom';
import { CommonConstants } from '../globalConstants';
const {
    ACCESS_TOKEN,
    REFRESH_TOKEN,
    IS_AUTHENTICATED,
    USER_ROLE,
    USER_NAME,
    USER_ID,
    REFRESH_TOKEN_TIME,
    ACCESS_TOKEN_TIME,
    USER_EMAIL,
} = CommonConstants;

// export const clearStorage = () => {
//     localStorage.setItem(ACCESS_TOKEN, '');
//     localStorage.setItem(REFRESH_TOKEN, '');
//     localStorage.setItem(IS_AUTHENTICATED, false);
//     // window.location.pathname = '/login';
// };

export const CommonUtils = {
    storeAuthData: function (data) {
        localStorage.setItem(USER_NAME, data.name);
        localStorage.setItem(USER_ROLE, data.role);
        localStorage.setItem(USER_ID, data.user_id);
        localStorage.setItem(IS_AUTHENTICATED, 'true');
        localStorage.setItem(USER_EMAIL, data.email);

        // localStorage.setItem(
        //     'segmentsFilterState',
        //     JSON.stringify({ segmentsFilter: 0, segmentTitle: 'Segment Filter' })
        // );
        // localStorage.setItem('USER_SIGN', data.cdn_signature);
    },

    saveTokens: function (data) {
        localStorage.setItem(ACCESS_TOKEN, data.access_token);
        localStorage.setItem(REFRESH_TOKEN, data.refresh_token);
        localStorage.setItem(REFRESH_TOKEN_TIME, +new Date());
        localStorage.setItem(ACCESS_TOKEN_TIME, +new Date());
    },

    clearStorage: function () {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        localStorage.removeItem(USER_NAME);
        localStorage.removeItem(USER_ROLE);
        localStorage.removeItem(USER_ID);
        localStorage.removeItem(IS_AUTHENTICATED);
        localStorage.removeItem(REFRESH_TOKEN_TIME);
        localStorage.removeItem(ACCESS_TOKEN_TIME);
        localStorage.removeItem(USER_EMAIL);
    },

    logout: function () {
        this.clearStorage();
        //navigate to be handled at function calling
    },

    //check refreshtoken validity
    checkRefreshTokenValidity: function () {
        const curTime = +new Date();
        const refreshTokenSaveTime = localStorage.getItem(REFRESH_TOKEN_TIME);
        //1 month time in ms 2,629,746,000
        return curTime - refreshTokenSaveTime < 2629746000;
    },
};
