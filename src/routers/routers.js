import { Route, Routes, Navigate } from 'react-router-dom';
import HomeLayout from '../container/Home/HomeLayout';
import AdminLayout from '../container/Admin/AdminLayout';

const Routers = () => {
    return (
        <Routes>
            <Route path='/' element={<Navigate to={'/home'} />} />
            <Route path='/home' element={<HomeLayout />} />
            <Route path='/users' element={<AdminLayout />} />
            <Route path='/login' element={<Navigate to={'/home'} />} />
        </Routes>
    );
};

export default Routers;
