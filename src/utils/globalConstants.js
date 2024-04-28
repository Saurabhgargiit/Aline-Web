export const CommonConstants = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    IS_AUTHENTICATED: 'IS_AUTHENTICATED',
    USER_ROLE: 'user_role',
    USER_NAME: 'user_name',
    USER_ID: 'user_id',
    REFRESH_TOKEN_TIME: 'refresh_token_time',
    ACCESS_TOKEN_TIME: 'access_token_time',
    USER_EMAIL: 'user_email',
    SESSION_EXP: 'SESSION_EXP',
};

export const FormErrors = {
    nameErr: 'Name cannot be blank.',
    emailErr: 'Please enter valid email ID.',
    passwordErr: 'Password should be between 6 to 12 letters.',
    repasswordErr: 'Password do not match',
    emptyField: 'Field is empty',
    pastDateError: 'Date must not be in the past.',
    ageError: 'Please enter a valid age.',
};

export const roles = {
    ROLE_ADMIN: 'ROLE_ADMIN',
    ROLE_LAB: 'ROLE_LAB',
    ROLE_CLINIC: 'ROLE_CLINIC',
    ROLE_DOCTOR: 'ROLE_DOCTOR',
};

//Error Messages
export const somethingWentWrong = 'Something went wrong. Please try again or contact administrator';

//Info messages
export const noDataInfo = 'There is no data to show.';

//LIMITS
export const MAXIMUM_RESULTS_ON_ONE_PAGE_IN_ADMIN = 9;
export const MAXIMUM_RESULTS_ON_ONE_PAGE_ON_HOME_PAGE = 10;
