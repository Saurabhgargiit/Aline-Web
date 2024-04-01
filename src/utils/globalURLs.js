export const _agent = 'localhost:3001';

export class ApiRelativePaths {
    //LOGIN
    static LOGIN_PATH = '/api/v1/aline/auth/login';
    static GET_TOKENS = '/api/v1/aline/auth/refreshToken';

    //Logout
    static LOGOUT = '/api/v1/aline/auth/logout';

    //USER
    static GET_USER = '/api/v1/aline/user/getSignedInUserInfo';
    static CREATE_PARENT_USER = '/api/v1/aline/user/createUserWithDetails';
    static GET_ALL_USERS = '/api/v1/aline/user/getAllUsersWithDetails';
}
