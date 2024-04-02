import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = () => {
  const isLoggedIn = useSelector((state: any) => state.auth.authentication);
  const profile = useSelector((state: any) => state.profile.profile);
  return isLoggedIn && profile.isadmin === 1 ? <Navigate to="/admin" /> : isLoggedIn && profile.isadmin === 0 ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
