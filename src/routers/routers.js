import { Route, Routes, Navigate } from 'react-router-dom';
import HomeLayout from '../container/Home/HomeLayout';
import AdminLayout from '../container/Admin/AdminLayout';
import PatientDetailsContainer from '../container/PatientDetails/PatientDetailsContainer';
import TreatmentPlanContainer from '../container/TreatmentPlan/TreatmentPlanContainer';
import TreatMentProgress from '../container/TreatMentProgress/TreatMentProgress';
import RebootRequest from '../container/RebootRequest/RebootRequest';
import RebootPlan from '../container/RebootPlan/RebootPlan';

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
            { path: 'treatmentPlan', element: <TreatmentPlanContainer /> },
            { path: 'progress', element: <TreatMentProgress /> },
            { path: 'rebootRequested', element: <RebootRequest /> },
            { path: 'rebootPlan', element: <RebootPlan /> },
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
