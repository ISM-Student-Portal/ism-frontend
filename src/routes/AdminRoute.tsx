import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const isLoggedIn = useSelector((state: any) => state.profile.profile);
  return isLoggedIn?.username ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;
