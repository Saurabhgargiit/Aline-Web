import { useNavigate } from 'react-router-dom';
import { CommonConstants } from '../globalConstants';
import { postCall } from './apicallactions';

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

  logout: async function () {
    try {
      const response = await this.logoutApiFunction();
    } catch (error) {
      console.error('Error during logout:', error); // This is also optional, but good for debugging.
    } finally {
      // This will run whether the logoutApiFunction resolved or rejected
      this.clearStorage();
      this.movetoLogin();
    }
  },

  movetoLogin: function () {
    window.location.pathname = '/login';
    window.location.reload();
  },

  logoutApiFunction: async function () {
    // Wrap the API call in a try-catch to handle any network errors.
    try {
      return await postCall({}, 'LOGOUT');
    } catch (error) {
      throw error; // Rethrow the error to be caught by the try-catch in 'logout'.
    }
  },

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

  generateGetApiPath: function (
    baseUrl,
    dynamicSegments = [],
    queryParams = {}
  ) {
    // Join the base URL with dynamic segments
    let path = `${baseUrl}${
      dynamicSegments.length > 0 ? '/' + dynamicSegments.join('/') : ''
    }`;

    // Convert query parameters object to a string
    const queryParamString = Object.entries(queryParams)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&');

    // Append query parameters to the path, if any
    if (queryParamString) {
      path += `?${queryParamString}`;
    }

    return path;
  },

  capitalizeFirstLetter: function (sentence) {
    return sentence
      .split(' ') // Split the sentence into an array of words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join the words back into a sentence
  },

  // Function to format today's date as YYYY-MM-DD
  formatDate: function (date, startWithDate = false, monthFormat = 'numeric') {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (monthFormat === 'short') {
      // Get month name in short format (e.g., Jan, Feb, etc.)
      month = d.toLocaleString('default', { month: 'short' });
    } else {
      // Pad month with zero if needed
      if (month.length < 2) month = '0' + month;
    }

    if (day.length < 2) day = '0' + day;

    if (startWithDate) {
      return monthFormat === 'short'
        ? [day, month, year].join('-') // DD-MMM-YYYY
        : [day, month, year].join('-'); // DD-MM-YYYY
    }
    return [year, month, day].join('-'); // YYYY-MM-DD
  },

  removeWhitespace: (str) => {
    return str.replace(/\s+/g, '');
  },

  checkSanityFailed: (item) => {
    return item === null || item === undefined;
  },
};

export const ScreenUtils = {
  // Mobile phones (commonly up to 767px)
  isMobileScreen: () => {
    return window.innerWidth <= 767;
  },

  // A "small mobile" might be extra-small devices (e.g., up to 480px)
  isSmallMobileScreen: () => {
    return window.innerWidth <= 480;
  },

  // Tablets often range from 768px to 1024px width
  isTabletScreen: () => {
    return window.innerWidth >= 768 && window.innerWidth <= 1200;
  },

  // Laptops or desktops could start above 1024px
  // Adjust as needed to 1200px or another breakpoint
  isLaptopScreen: () => {
    return window.innerWidth > 1200;
  },

  // Orientation: Portrait mode if height is greater than width
  isPortraitOrientation: () => {
    return window.innerHeight > window.innerWidth;
  },

  // Orientation: Landscape mode if width is greater than height
  isLandscapeOrientation: () => {
    return window.innerWidth > window.innerHeight;
  },
};

export const sanitizeFileName = (fileName) => {
  return fileName
    .normalize('NFKD') // Normalize Unicode characters
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
    .replace(/\s+/g, '_'); // Replace spaces with underscores
};
