import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Main from '@modules/main/Main';
import Login from '@modules/login/Login';
import Register from '@modules/register/Register';
import ForgetPassword from '@modules/forgot-password/ForgotPassword';
import RecoverPassword from '@modules/recover-password/RecoverPassword';
import { useWindowSize } from '@app/hooks/useWindowSize';
import { calculateWindowSize } from '@app/utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { setWindowSize } from '@app/store/reducers/ui';
import ReactGA from 'react-ga4';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

import Dashboard from '@pages/Dashboard';
import Blank from '@pages/Blank';
import SubMenu from '@pages/SubMenu';
import Profile from '@pages/profile/Profile';

import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import { setAuthentication } from './store/reducers/auth';
import {
  GoogleProvider,
  getAuthStatus,
  getFacebookLoginStatus,
  getProfileStatus,
} from './utils/oidc-providers';
import { Spinner } from './styles/common';
import { setProfile } from './store/reducers/profile';
import AdminRoute from './routes/AdminRoute';
import Students from './pages/Students';
import Classroom from './pages/Classroom';
import Assignment2 from './pages/Assignment'
import Assignment from './pages/student_pages/Assignment';
import StudentClassroom from './pages/student_pages/StudentClassroom';
import StudentNotification from './pages/student_pages/StudentNotification';
import StudentDashboard from './pages/student_pages/StudentDashboard';
import Submission from './pages/student_pages/Submission';
import Admins from './pages/Admins';
import ResetPassword from './modules/reset-password/ResetPassword';

const { VITE_NODE_ENV } = import.meta.env;

const App = () => {
  const windowSize = useWindowSize();
  const screenSize = useSelector((state: any) => state.ui.screenSize);
  const dispatch = useDispatch();
  const location = useLocation();

  const [isAppLoading, setIsAppLoading] = useState(true);

  const checkSession = async () => {
    try {
      let responses: any = await Promise.all([
        // getFacebookLoginStatus(),
        // GoogleProvider.getUser(),
        getAuthStatus(),
      ]);
      let profile: any = await getProfileStatus();

      responses = responses.filter((r: any) => Boolean(r));

      if (responses && responses.length > 0) {
        dispatch(setAuthentication(responses[0]));
        dispatch(setProfile(profile));
      }
    } catch (error: any) {
      console.log('error', error);
    }
    setIsAppLoading(false);
  };

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    const size = calculateWindowSize(windowSize.width);
    if (screenSize !== size) {
      dispatch(setWindowSize(size));
    }
  }, [windowSize]);

  useEffect(() => {
    if (location && location.pathname && VITE_NODE_ENV === 'production') {
      ReactGA.send({
        hitType: 'pageview',
        page: location.pathname,
      });
    }
  }, [location]);

  if (isAppLoading) {
    return <div className='w-100'>
      <p className='mx-auto my-auto '><h6>Loading <Spinner type='grow' /></h6></p>
    </div>;
  }

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Routes>
          <Route path="/login" element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route path="/register" element={<PublicRoute />}>
            <Route path="/register" element={<Register />} />
          </Route>
          <Route path="/forgot-password" element={<PublicRoute />}>
            <Route path="/forgot-password" element={<ForgetPassword />} />
          </Route>
          <Route path="/password/reset" element={<PublicRoute />}>
            <Route path="/password/reset" element={<ResetPassword />} />
          </Route>
          <Route path="/recover-password" element={<PublicRoute />}>
            <Route path="/recover-password" element={<RecoverPassword />} />
          </Route>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<Main />}>
              <Route path="/assignments" element={<Assignment />} />
              <Route path="/classroom" element={<StudentClassroom />} />
              <Route path="/notification" element={<StudentNotification />} />
              <Route path="/submissions" element={<Submission />} />

              <Route path="/profile" element={<Profile />} />
              <Route path="/" element={<StudentDashboard />} />
            </Route>
          </Route>

          <Route path="/admin" element={<AdminRoute />}>
            <Route path="/admin" element={<Main />}>
              <Route path="admin/sub-menu-2" element={<Blank />} />
              <Route path="admin/sub-menu-1" element={<SubMenu />} />
              <Route path="/admin/students" element={<Students />} />
              <Route path="/admin/admins" element={<Admins />} />

              <Route path="/admin/profile" element={<Profile />} />
              <Route path="/admin/classroom" element={<Classroom />} />
              <Route path="/admin/assignment" element={<Assignment2 />} />

              <Route path="/admin/" element={<Dashboard />} />
            </Route>
          </Route>


        </Routes>
        <ToastContainer
          autoClose={3000}
          draggable={false}
          position="top-right"
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnHover
        />
      </LocalizationProvider>
    </>
  );
};

export default App;
