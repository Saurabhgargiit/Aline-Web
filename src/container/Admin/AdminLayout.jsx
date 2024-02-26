import React, { useState, useContext } from 'react';
import UserList from './UserList';
import AddClinicLayout from './AddClinic/AddClinicLayout';
import { AddClinicContextProvider } from './AddClinic/Context/AddClinicContext';
import AdminHeaderBar from './AdminHeaderBar/AdminHeaderBar';

const AdminLayout = () => {
    return (
        <AddClinicContextProvider>
            <div className='top-bottom-position-container'>
                <AdminHeaderBar />
                <UserList />
                <AddClinicLayout />
            </div>
        </AddClinicContextProvider>
    );
};

export default AdminLayout;
