import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const isLoggedIn = useSelector((state: any) => state.auth.authentication);
  const isAdmin = useSelector((state: any) => state.profile.profile);
  return isLoggedIn && isAdmin?.is_admin ? <Navigate to="/admin" /> : isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
