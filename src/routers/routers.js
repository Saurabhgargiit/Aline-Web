import { Route, Routes, Navigate } from 'react-router-dom';
import HomeLayout from '../container/Home/HomeLayout';

const Routers = () => {
    return (
        <Routes>
            <Route path='/' element={<Navigate to={'/home'} />} />
            <Route path='/home' element={<HomeLayout />} />
            <Route path='/admin' element={<div>admin</div>} />
        </Routes>
    );
};

export default Routers;
