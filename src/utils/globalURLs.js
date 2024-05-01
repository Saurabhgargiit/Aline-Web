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
    static UPDATE_USER = '/api/v1/aline/user/updateUserWithDetails';
    static PASS_CHANGE_BY_ADMIN = '/api/v1/aline/user/forgotPassword';
    static GET_ALL_USERS = '/api/v1/aline/user/getAllUsers';
    static GET_ALL_USERS_WITH_DETAILS = '/api/v1/aline/user/getAllUsersWithDetails';
    static ADD_EXISTING_DOCTOR_TO_CLINIC =
        '/api/v1/aline/clinicDoctorRelationship/addExistingDoctorToClinic';

    //Patient Basic Information
    static CREATE_PATIENT = '/api/v1/aline/patient/createPatient';
    static GET_ALL_PATIENTS = '/api/v1/aline/patient/getAllPatients';
    static UPDATE_PATIENT = '/api/v1/aline/patient/updatePatient';
    static UPDATE_STATUS = '/api/v1/aline/patient/updatePatientStatus';
    static DELETE_PATIENT = '/api/v1/aline/patient/deletePatient';
}
