import { Route, Routes, Navigate } from 'react-router-dom';
import HomeLayout from '../container/Home/HomeLayout';
import AdminLayout from '../container/Admin/AdminLayout';

import PatientDetailsContainer from '../container/PatientDetails/PatientDetailsContainer';
import PhotosScansForm from '../container/PatientDetails/PatientDetailsForm/PhotosScansForm';
import TreatmentPlanLayout from '../container/TreatmentPlan/TreatmentPlanLayout';
import TreatMentProgress from '../container/TreatMentProgress/TreatMentProgress';
import RebootRequest from '../container/RebootRequest/RebootRequest';
import RebootPlan from '../container/RebootPlan/RebootPlan';
import PatientDetailsLayout from '../container/PatientDetailsLayout/PatientDetailsLayout';
import FillerPage from '../container/FillerPages/FillerPage';

// Define a simple route configuration
const routeConfig = [
  { path: '/', element: <Navigate to="/home" /> },
  { path: '/home', element: <HomeLayout /> },
  { path: '/users', element: <AdminLayout /> },
  { path: '/login', element: <Navigate to="/home" /> },
  {
    path: '/patientDetails/:patientID/:rebootID',
    element: <PatientDetailsLayout />,
    children: [
      { path: 'details', element: <PatientDetailsContainer /> },
      { path: 'photosScans', element: <PhotosScansForm /> },
      { path: 'treatmentPlan/:planType', element: <TreatmentPlanLayout /> },
      { path: 'progress', element: <TreatMentProgress /> },
      { path: 'rebootRequested', element: <RebootRequest /> },
      { path: 'rebootPlan', element: <RebootPlan /> },
    ],
  },
  { path:'*', element: <FillerPage message={'Page Not Found. Please enter correct url.'}/>}
];

const Routers = () => {
  return (
    <Routes>
      {routeConfig.map(route => {
        if (route.children) {
          return (
            <Route path={route.path} key={route.path} element={route.element}>
              <Route index element={<Navigate to="details" />} />
              {route.children.map(child => (
                <Route
                  path={child.path}
                  element={child.element}
                  key={child.path}
                />
              ))}
            </Route>
          );
        }
        return (
          <Route path={route.path} element={route.element} key={route.path} />
        );
      })}
    </Routes>
  );
};

export default Routers;
