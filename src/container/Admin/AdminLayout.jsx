import { UseSelector, useSelector } from 'react-redux';
import UserList from './UserList';
import AddParentUserLayout from './AddParentUser/AddParentUserLayout';
import { AddParentUserContextProvider } from './AddParentUser/Context/AddParentUserContext';
import AdminHeaderBar from './AdminHeaderBar/AdminHeaderBar';
import { withReducer } from '../../hoc/withReducer';
import withRouter from '../../hoc/withRouter';
import getAllUsersReducer from '../../store/reducers/userreducer/getAllUsersReducer';
import AdminPagination from './AdminPagination';
import ChangePasswordModal from './ChangePassword/ChangePasswordModal';
import AddExisitingDoctorToClinicModal from './AddExisitingDoctorToClinic/AddExisitingDoctorToClinicModal';

const AdminLayout = () => {
    const fetchedUserInfo = useSelector((state) => state.userInfoReducer?.userInfo?.data);
    //userID and role here are of the logged In person
    const {
        id: userID,
        role: [role],
    } = fetchedUserInfo;

    return (
        <AddParentUserContextProvider>
            <div className='top-bottom-position-container top112'>
                <AdminHeaderBar userID={userID} role={role} />
                <UserList userID={userID} role={role} />
                <AddParentUserLayout />
                <ChangePasswordModal />
                <AddExisitingDoctorToClinicModal />
            </div>
            <AdminPagination />
        </AddParentUserContextProvider>
    );
};

export default withRouter(withReducer('getAllUsers', getAllUsersReducer)(AdminLayout));
