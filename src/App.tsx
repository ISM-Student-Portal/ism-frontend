import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Main from '@modules/main/Main';
import AdminMain from '@modules/admin/Main';
import LecturerMain from '@modules/lecturer/Main';
import Login from '@modules/login/Login';
import Register from '@modules/register/Register';
import ForgetPassword from '@modules/forgot-password/ForgotPassword';
import RecoverPassword from '@modules/recover-password/RecoverPassword';
import { useWindowSize } from '@app/hooks/useWindowSize';
import { calculateWindowSize } from '@app/utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { setWindowSize } from '@app/store/reducers/ui';
import ReactGA from 'react-ga4';

import Dashboard from '@pages/Dashboard';
import Blank from '@pages/Blank';
import SubMenu from '@pages/SubMenu';
import Profile from '@pages/profile/Profile';

import PublicRoute from './routes/PublicRoute';
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
import LecturerRoute from './routes/LecturerRoute';
import StudentRoute from './routes/StudentRoute';

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
        getFacebookLoginStatus(),
        GoogleProvider.getUser(),
        getAuthStatus(),
      ]);
      let profile: any = await getProfileStatus();
      console.log(profile, 'entry')

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
        <Route path="/recover-password" element={<PublicRoute />}>
          <Route path="/recover-password" element={<RecoverPassword />} />
        </Route>
        <Route path="/" element={<StudentRoute />}>
          <Route path="/" element={<Main />}>
            <Route path="/sub-menu-2" element={<Blank />} />
            <Route path="/sub-menu-1" element={<SubMenu />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Route>

        <Route path="/admin" element={<AdminRoute />}>
          <Route path="/admin" element={<AdminMain />}>
            <Route path="admin/sub-menu-2" element={<Blank />} />
            <Route path="admin/sub-menu-1" element={<SubMenu />} />
            <Route path="/admin/students" element={<Students />} />
            <Route path="admin/profile" element={<Profile />} />
            <Route path="/admin/" element={<Dashboard />} />
          </Route>
        </Route>

        <Route path="/lecturer" element={<LecturerRoute />}>
          <Route path="/lecturer" element={<LecturerMain />}>
            <Route path="lecturer/sub-menu-2" element={<Blank />} />
            <Route path="lecturer/sub-menu-1" element={<SubMenu />} />
            <Route path="/lecturer/students" element={<Students />} />
            <Route path="lecturer/profile" element={<Profile />} />
            <Route path="/lecturer/" element={<Dashboard />} />
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
    </>
  );
};

export default App;
