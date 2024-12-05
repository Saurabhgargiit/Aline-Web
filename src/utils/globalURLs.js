export const _agent = process.env.REACT_APP_API_URL;

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
  static GET_ALL_USERS_WITH_DETAILS =
    '/api/v1/aline/user/getAllUsersWithDetails';
  static ADD_EXISTING_DOCTOR_TO_CLINIC =
    '/api/v1/aline/clinicDoctorRelationship/addExistingDoctorToClinic';
  static DELETE_USER = '/api/v1/aline/user/deleteUserByID';

  //Patient Basic Information
  static CREATE_PATIENT = '/api/v1/aline/patient/createPatient';
  static GET_ALL_PATIENTS = '/api/v1/aline/patient/getAllPatients';
  static UPDATE_PATIENT = '/api/v1/aline/patient/updatePatient';
  static UPDATE_STATUS = '/api/v1/aline/patient/updatePatientStatus';
  static DELETE_PATIENT = '/api/v1/aline/patient/deletePatient';

  //Patient Details
  static GET_PATIENT_DETAILS =
    '/api/v1/aline/patientDentalDetails/getPatientDentalDetailByPatientID';
  static UPDATE_PATIENT_DETAILS =
    '/api/v1/aline/patientDentalDetails/updatePatientDentalDetail';
  static GET_PATIENT_N_USER_INFO =
    '/api/v1/aline/patient/getUserDetailsForPatientID';

  //Photos & Scans
  static GET_PHOTOS_SCANS_URLS =
    '/api/v1/aline/patientPhotoScans/getPatientPhotoScansByPatientID';
  static ADD_URLS_TO_DATABASE =
    '/api/v1/aline/patientPhotoScans/updatePatientPhotoScans';

  //Reboots
  static GET_REBOOT_IDS = '/api/v1/aline/dentalDetailsMapping/getAllRebootIds';
  static CREATE_REBOOT = '/api/v1/aline/dentalDetailsMapping/createReboot';

  //Treatment Plans
  static GET_TREATMENTPLAN_MAPPING =
    '/api/v1/aline/dentalDetailsMapping/getPlanMapping';
  static CREATE_TREATMENT_PLAN = '/api/v1/aline/treatmentPlan/saveDraft'; //POST
  static UPDATE_TREATMENT_PLAN = '/api/v1/aline/treatmentPlan/updateDraft'; //PULL
  static GET_TREATMENT_PLAN_DETAILS = '/api/v1/aline/treatmentPlan/getPlan';
  static SHARE_PLAN_WITH_DOCTOR =
    '/api/v1/aline/treatmentPlan/sendPlanModification';
  static REQUEST_FOR_MODIFICATION =
    '/api/v1/aline/treatmentPlan/planRequestModification';
  static APPROVE_PLAN = '/api/v1/aline/treatmentPlan/approvePlan';

  //Treatment Prgress
  static CREATE_VISIT = '/api/v1/aline/treatmentProgress/createProgress'; // post
  static UPDATE_VISIT = '/api/v1/aline/treatmentProgress/updateProgress'; // pUT
  static GET_TABLE_OF_PROGRESS =
    '/api/v1/aline/treatmentProgress/getAllProgress';
  static GET_PROGRESS_DETAIL = '/api/v1/aline/treatmentProgress/getProgress';
}
