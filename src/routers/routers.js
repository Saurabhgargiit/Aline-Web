import react, { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Loader from '../container/common/Loader/Loader';

const HomeLayout = lazy(() => import('../container/Home/HomeLayout'));
const AdminLayout = lazy(() => import('../container/Admin/AdminLayout'));
const PatientDetailsContainer = lazy(() =>
  import('../container/PatientDetails/PatientDetailsContainer')
);
const PhotosScansForm = lazy(() =>
  import('../container/PatientDetails/PatientDetailsForm/PhotosScansForm')
);
const TreatmentPlanLayout = lazy(() =>
  import('../container/TreatmentPlan/TreatmentPlanLayout')
);
const TreatmentProgress = lazy(() =>
  import('../container/TreatmentProgress/TreatmentProgress')
);
const TreatmentProgressForm = lazy(() =>
  import('../container/TreatmentProgress/TreatmentProgressForm')
);
const RebootRequest = lazy(() =>
  import('../container/RebootRequest/RebootRequest')
);
const RebootPlan = lazy(() => import('../container/RebootPlan/RebootPlan'));
const PatientDetailsLayout = lazy(() =>
  import('../container/PatientDetailsLayout/PatientDetailsLayout')
);
const FillerPage = lazy(() => import('../container/FillerPages/FillerPage'));

// Define a simple route configuration
const routeConfig = [
  { path: '/', element: <Navigate to="/home" /> },
  { path: '/home', element: <HomeLayout /> },
  { path: '/users', element: <AdminLayout /> },
  { path: '/login', element: <Navigate to="/home" /> },
  {
    path: '/patientDetails/:patientID',
    element: <PatientDetailsLayout />,
    children: [
      { path: 'details', element: <PatientDetailsContainer /> },
      { path: 'photosScans', element: <PhotosScansForm /> },
      { path: 'treatmentPlan/:planType', element: <TreatmentPlanLayout /> },
      { path: 'progress', element: <TreatmentProgress /> },
      { path: 'progress/:visitMode', element: <TreatmentProgressForm /> },
      { path: 'rebootRequested', element: <RebootRequest /> },
      { path: 'rebootPlan', element: <RebootPlan /> },
    ],
  },
  {
    path: '*',
    element: (
      <FillerPage
        message={'Page Not Found. Please check details or contact admin.'}
      />
    ),
  },
];

const Routers = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {routeConfig.map((route) => {
          if (route.children) {
            return (
              <Route path={route.path} key={route.path} element={route.element}>
                <Route index element={<Navigate to="details" />} />
                {route.children.map((child) => (
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
    </Suspense>
  );
};

export default Routers;
