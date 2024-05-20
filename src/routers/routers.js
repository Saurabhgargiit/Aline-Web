import { Route, Routes, Navigate } from 'react-router-dom';
import HomeLayout from '../container/Home/HomeLayout';
import AdminLayout from '../container/Admin/AdminLayout';
import PatientDetailsContainer from '../container/PatientDetails/PatientDetailsContainer';

// Define a simple route configuration
const routeConfig = [
    { path: '/', element: <Navigate to='/home' /> },
    { path: '/home', element: <HomeLayout /> },
    { path: '/users', element: <AdminLayout /> },
    { path: '/login', element: <Navigate to='/home' /> },
    {
        path: '/patientDetails/:patientID',
        children: [
            { path: 'details', element: <PatientDetailsContainer /> },
            { path: 'treatmentPlan', element: <div>Treatment Plan</div> },
            { path: 'progress', element: <div>Treatment Progress</div> },
            { path: 'rebootRequested', element: <div>Reboot Request</div> },
            { path: 'rebootPlan', element: <div>Treatment Plan</div> },
        ],
    },
];

const Routers = () => {
    return (
        <Routes>
            {routeConfig.map((route) => {
                if (route.children) {
                    return (
                        <Route path={route.path} key={route.path}>
                            {route.children.map((child) => (
                                <Route path={child.path} element={child.element} key={child.path} />
                            ))}
                        </Route>
                    );
                }
                return <Route path={route.path} element={route.element} key={route.path} />;
            })}
        </Routes>
    );
};

export default Routers;
