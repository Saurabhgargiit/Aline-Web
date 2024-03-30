import { UseSelector, useSelector } from 'react-redux';
import UserList from './UserList';
import AddParentUserLayout from './AddParentUser/AddParentUserLayout';
import { AddParentUserContextProvider } from './AddParentUser/Context/AddParentUserContext';
import AdminHeaderBar from './AdminHeaderBar/AdminHeaderBar';
import { withReducer } from '../../hoc/withReducer';
import withRouter from '../../hoc/withRouter';
import getAllUsersReducer from '../../store/reducers/userreducer/getAllUsersReducer';

const AdminLayout = () => {
    const fetchedUserInfo = useSelector((state) => state.userInfoReducer?.userInfo?.data);
    console.log(fetchedUserInfo);
    const {
        id: userID,
        role: [role],
    } = fetchedUserInfo;
    return (
        <AddParentUserContextProvider>
            <div className='top-bottom-position-container'>
                <AdminHeaderBar userID={userID} role={role} />
                <UserList userID={userID} role={role} />
                <AddParentUserLayout />
            </div>
        </AddParentUserContextProvider>
    );
};

export default withRouter(withReducer('getAllUsers', getAllUsersReducer)(AdminLayout));
