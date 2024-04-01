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
    SESSION_EXP,
} = CommonConstants;

export const CommonUtils = {
    storeUserData: function (data) {
        localStorage.setItem(USER_ROLE, data.role);
        localStorage.setItem(USER_ID, data.id);
        localStorage.setItem(USER_EMAIL, data.email);

        // localStorage.setItem(
        //     'segmentsFilterState',
        //     JSON.stringify({ segmentsFilter: 0, segmentTitle: 'Segment Filter' })
        // );
        // localStorage.setItem('USER_SIGN', data.cdn_signature);
    },

    saveTokens: function (data) {
        localStorage.setItem(ACCESS_TOKEN, `Bearer ${data.access_token}`);
        localStorage.setItem(REFRESH_TOKEN, `Bearer ${data.refresh_token}`);
        localStorage.setItem(REFRESH_TOKEN_TIME, +new Date());
        localStorage.setItem(ACCESS_TOKEN_TIME, +new Date());
        localStorage.setItem(SESSION_EXP, 'false');
    },

    clearStorage: function () {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN_TIME);
        localStorage.removeItem(ACCESS_TOKEN_TIME);
        localStorage.removeItem(SESSION_EXP);

        localStorage.removeItem(USER_ROLE);
        localStorage.removeItem(USER_ID);
        localStorage.removeItem(USER_EMAIL);

        localStorage.removeItem(IS_AUTHENTICATED);
    },

    logout: function () {
        this.clearStorage();
        this.movetoLogin();
        this.logoutApiFunction();
    },

    movetoLogin: function () {
        window.location.pathname = '/login';
        window.location.reload();
    },

    logoutApiFunction: function () {},

    //check refreshtoken validity
    checkRefreshTokenValidity: function () {
        const curTime = +new Date();
        const refreshTokenSaveTime = localStorage.getItem(REFRESH_TOKEN_TIME);
        //1 month time in ms 2,629,746,000
        return curTime - refreshTokenSaveTime < 2629746000;
    },

    isAdmin: function (role) {
        return role === 'ROLE_ADMIN';
    },
    isLab: function (role) {
        return role === 'ROLE_LAB';
    },
    isClinic: function (role) {
        return role === 'ROLE_CLINIC';
    },
    isDoctor: function (role) {
        return role === 'ROLE_DOCTOR';
    },
    getPayloadRole: function (userRole) {
        switch (userRole) {
            case 'Admin':
            case 'admin':
                return 'ROLE_ADMIN';
            case 'Lab':
            case 'lab':
                return 'ROLE_LAB';
            case 'Clinic':
            case 'clinic':
                return 'ROLE_CLINIC';
            case 'Doctor':
            case 'doctor':
                return 'ROLE_DOCTOR';
        }
    },

    generateGetApiPath: function (baseUrl, dynamicSegments = [], queryParams = {}) {
        // Join the base URL with dynamic segments
        let path = `${baseUrl}/${dynamicSegments.join('/')}`;

        // Convert query parameters object to a string
        const queryParamString = Object.entries(queryParams)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        // Append query parameters to the path, if any
        if (queryParamString) {
            path += `?${queryParamString}`;
        }

        return path;
    },
};
