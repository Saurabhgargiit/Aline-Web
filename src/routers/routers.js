import { Route, Routes, Navigate } from 'react-router-dom';
import HomeLayout from '../container/Home/HomeLayout';
import AdminLayout from '../container/Admin/AdminLayout';
import PatientDetailsContainer from '../container/PatientDetails/PatientDetailsContainer';
import PatientDetailsLayout from '../container/PatientDetails/PatientDetailsLayout';

const Routers = () => {
    return (
        <Routes>
            <Route path='/' element={<Navigate to={'/home'} />} />
            <Route path='/home' element={<HomeLayout />} />
            <Route path='/users' element={<AdminLayout />} />
            <Route path='/login' element={<Navigate to={'/home'} />} />
            <Route path='patientDetails/:patientID' element={<PatientDetailsContainer />} />
        </Routes>
    );
};

export default Routers;
