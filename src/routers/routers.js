import { Route, Routes, Navigate } from 'react-router-dom';
import HomeLayout from '../container/Home/HomeLayout';
import Admin from '../container/Admin/Admin';

const Routers = () => {
    return (
        <Routes>
            <Route path='/' element={<Navigate to={'/home'} />} />
            <Route path='/home' element={<HomeLayout />} />
            <Route path='/admin' element={<Admin />} />
        </Routes>
    );
};

export default Routers;
