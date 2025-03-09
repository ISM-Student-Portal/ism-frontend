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
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import PublicRoute from './routes/PublicRoute';
import { setAuthentication } from './store/reducers/auth';
import {
  getAuthStatus,
  getProfileStatus,
} from './utils/oidc-providers';
import { Spinner } from './styles/common';
import { setProfile } from './store/reducers/profile';
import AdminRoute from './routes/AdminRoute';
import Students from './modules/admin/pages/Students';
import LecturerRoute from './routes/LecturerRoute';
import StudentRoute from './routes/StudentRoute';
import Dashboard from './modules/admin/pages/Dashboard';
import Payments from './modules/admin/pages/Payments';
import Courses from './modules/admin/pages/Courses';
import Admins from './modules/admin/pages/Admins';
import Lecturers from './modules/admin/pages/Lecturers';
import { ColorRing } from 'react-loader-spinner';

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
    return <div className='h-100 d-flex align-items-center justify-content-center'><ColorRing
      visible={true}
      height="150"
      width="150"
      ariaLabel="color-ring-loading"
      wrapperStyle={{}}
      wrapperClass="color-ring-wrapper"
      colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}

    />Loading... Please wait </div>;
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

          </Route>
        </Route>

        <Route path="/admin" element={<AdminRoute />}>
          <Route path="/admin" element={<AdminMain />}>
            <Route path='' element={<Dashboard />} />
            <Route path='students' element={<Students />} />
            <Route path='payments' element={<Payments />} />
            <Route path='courses' element={<Courses />} />
            <Route path='admins' element={<Admins />} />
            <Route path='lecturers' element={<Lecturers />} />


          </Route>
        </Route>

        <Route path="/lecturer" element={<LecturerRoute />}>
          <Route path="/lecturer" element={<LecturerMain />}>

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
